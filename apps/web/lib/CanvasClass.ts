import axios from 'axios';
import { Mode, SelectedShapeType, Shape, ViewPort } from './types';
import { v4 as uuidv4 } from 'uuid';

export class CanvasClass {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private Shapes: Shape[] = [];
  private x = 0;
  private y = 0;
  private mouseDown = false;
  private currentShape: SelectedShapeType = 'circle';
  private roomId: string | undefined;
  private socket: WebSocket | null = null;
  private mode: Mode = 'drawing';
  private viewPorts: ViewPort = { x: 0, y: 0, scale: 1 };

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = canvas.getContext('2d');
    this.ctx!.strokeStyle = 'white';
  }

  resetScale() {
    this.viewPorts = { x: 0, y: 0, scale: 1 };
    this.refreshCanvas();
  }
  setShape(shape: SelectedShapeType) {
    this.currentShape = shape;
  }
  setRoomId(roomId: string) {
    this.roomId = roomId;
  }
  setMode(mode: Mode) {
    this.mode = mode;
  }

  undo() {
    const shape = this.Shapes.pop();
    this.refreshCanvas();
    this.socket?.send(
      JSON.stringify({
        type: 'delete-shape',
        roomId: this.roomId,
        shape: { data: shape },
      })
    );
  }

  async getShapes() {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${this.roomId}/shapes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      this.Shapes = res.data.shapes.map((shape: { data: Shape }) => shape.data);
      this.refreshCanvas();
    }
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'shape') {
        const { data: shape } = data.shape;
        this.Shapes.push(shape);
        this.refreshCanvas();
      }
      if (data.type === 'delete-shape') {
        const shape = data.shape;
        this.Shapes = this.Shapes.filter((s) => s.uuid !== shape.data.uuid);
        this.refreshCanvas();
      }
    };
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.x = e.clientX;
    this.y = e.clientY;
    this.mouseDown = true;
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (
      this.mouseDown &&
      this.mode === 'drawing' &&
      this.x - e.clientX !== 0 &&
      this.y - e.clientY !== 0
    ) {
      this.refreshCanvas();
      if (this.currentShape === 'rectangle') {
        this.ctx!.strokeRect(
          (this.x - this.viewPorts.x) / this.viewPorts.scale,
          (this.y - this.viewPorts.y) / this.viewPorts.scale,
          e.clientX - this.x,
          e.clientY - this.y
        );
      } else if (this.currentShape === 'circle') {
        this.ctx!.beginPath();
        this.ctx!.arc(
          (this.x - this.viewPorts.x) / this.viewPorts.scale,
          (this.y - this.viewPorts.y) / this.viewPorts.scale,
          Math.sqrt(
            Math.pow(e.clientX - this.x, 2) + Math.pow(e.clientY - this.y, 2)
          ),
          0,
          2 * Math.PI
        );
        this.ctx!.stroke();
      } else if (this.currentShape === 'line') {
        this.ctx!.beginPath();
        this.ctx!.moveTo(
          (this.x - this.viewPorts.x) / this.viewPorts.scale,
          (this.y - this.viewPorts.y) / this.viewPorts.scale
        );
        this.ctx!.lineTo(
          (e.clientX - this.viewPorts.x) / this.viewPorts.scale,
          (e.clientY - this.viewPorts.y) / this.viewPorts.scale
        );
        this.ctx!.stroke();
      }
    } else if (this.mouseDown && this.mode === 'pan') {
      this.viewPorts.x += e.clientX - this.x;
      this.viewPorts.y += e.clientY - this.y;
      this.x = e.clientX;
      this.y = e.clientY;
      this.refreshCanvas();
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.mouseDown = false;
    if (
      this.mode === 'drawing' &&
      this.x - e.clientX !== 0 &&
      this.y - e.clientY !== 0
    ) {
      if (this.currentShape === 'rectangle') {
        const rectangle: Shape = {
          type: 'rectangle',
          x: (this.x - this.viewPorts.x) / this.viewPorts.scale,
          y: (this.y - this.viewPorts.y) / this.viewPorts.scale,
          width: e.clientX - this.x,
          height: e.clientY - this.y,
          uuid: uuidv4(),
        };
        this.Shapes.push(rectangle);
        this.socket?.send(
          JSON.stringify({
            type: 'shape',
            roomId: this.roomId,
            shape: {
              data: rectangle,
            },
          })
        );
      } else if (this.currentShape === 'circle') {
        const circle: Shape = {
          type: 'circle',
          x: (this.x - this.viewPorts.x) / this.viewPorts.scale,
          y: (this.y - this.viewPorts.y) / this.viewPorts.scale,
          radius: Math.sqrt(
            Math.pow(e.clientX - this.x, 2) + Math.pow(e.clientY - this.y, 2)
          ),
          uuid: uuidv4(),
        };
        this.Shapes.push(circle);
        this.socket?.send(
          JSON.stringify({
            type: 'shape',
            roomId: this.roomId,
            shape: {
              data: circle,
            },
          })
        );
      } else if (this.currentShape === 'line') {
        const line: Shape = {
          type: 'line',
          x: (this.x - this.viewPorts.x) / this.viewPorts.scale,
          y: (this.y - this.viewPorts.y) / this.viewPorts.scale,
          x2: (e.clientX - this.viewPorts.x) / this.viewPorts.scale,
          y2: (e.clientY - this.viewPorts.y) / this.viewPorts.scale,
          uuid: uuidv4(),
        };
        this.Shapes.push(line);
        this.socket?.send(
          JSON.stringify({
            type: 'shape',
            roomId: this.roomId,
            shape: {
              data: line,
            },
          })
        );
      }
    }
    this.refreshCanvas();
  };

  mouseScrollHandler = (e: WheelEvent) => {
    const previousScale = this.viewPorts.scale;
    let newScale = previousScale + e.deltaY * -0.001;
    newScale = Math.max(0.09, newScale);

    const newX =
      e.clientX - (e.clientX - this.viewPorts.x) * (newScale / previousScale);
    const newY =
      e.clientY - (e.clientY - this.viewPorts.y) * (newScale / previousScale);

    this.viewPorts.x = newX;
    this.viewPorts.y = newY;
    this.viewPorts.scale = newScale;
    this.refreshCanvas();
  };

  refreshCanvas() {
    this.ctx?.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.ctx?.setTransform(
      this.viewPorts.scale,
      0,
      0,
      this.viewPorts.scale,
      this.viewPorts.x,
      this.viewPorts.y
    );

    this.Shapes.forEach((shape) => {
      if (shape.type === 'rectangle') {
        this.ctx!.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
      if (shape.type === 'circle') {
        this.ctx!.beginPath();
        this.ctx!.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        this.ctx!.stroke();
      }
      if (shape.type === 'line') {
        this.ctx!.beginPath();
        this.ctx!.moveTo(shape.x, shape.y);
        this.ctx!.lineTo(shape.x2, shape.y2);
        this.ctx!.stroke();
      }
    });
  }

  // ------------------------- Event Handlers --------------------
  addHandlers() {
    this.canvas!.addEventListener('mousedown', this.mouseDownHandler);
    this.canvas!.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas!.addEventListener('mouseup', this.mouseUpHandler);
    this.canvas!.addEventListener('wheel', this.mouseScrollHandler);
  }
  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
      this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
      this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
      this.canvas.removeEventListener('wheel', this.mouseScrollHandler);
    }
  }
}
