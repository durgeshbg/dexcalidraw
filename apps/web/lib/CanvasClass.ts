import axios from 'axios';
import { SelectedShapeType, Shape } from './types';

export class CanvasClass {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private Shapes: Shape[];
  private x = 0;
  private y = 0;
  private drawing = false;
  private currentShape: SelectedShapeType = 'circle';
  private roomId: string | undefined;
  private socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = canvas.getContext('2d');
    this.ctx!.strokeStyle = 'white';
    this.Shapes = [];
  }

  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
      this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
      this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
    }
  }

  setShape(shape: SelectedShapeType) {
    this.currentShape = shape;
  }

  setRoomId(roomId: string) {
    this.roomId = roomId;
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
      res.data.shapes.forEach((shape: { data: Shape }) => {
        this.Shapes.push(shape.data);
      });
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
    };
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.x = e.clientX;
    this.y = e.clientY;
    this.drawing = true;
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.drawing) {
      this.refreshCanvas();
      if (this.currentShape === 'rectangle') {
        this.ctx!.strokeRect(
          this.x,
          this.y,
          e.clientX - this.x,
          e.clientY - this.y
        );
      } else if (this.currentShape === 'circle') {
        this.ctx!.beginPath();
        this.ctx!.arc(
          this.x,
          this.y,
          Math.sqrt(
            Math.pow(e.clientX - this.x, 2) + Math.pow(e.clientY - this.y, 2)
          ),
          0,
          2 * Math.PI
        );
        this.ctx!.stroke();
      }
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.drawing = false;
    if (this.currentShape === 'rectangle') {
      const rectangle: Shape = {
        type: 'rectangle',
        x: this.x,
        y: this.y,
        width: e.clientX - this.x,
        height: e.clientY - this.y,
      };
      this.Shapes.push(rectangle);
      this.socket.send(
        JSON.stringify({
          type: 'shape',
          shape: {
            roomId: this.roomId,
            data: rectangle,
          },
        })
      );
    } else if (this.currentShape === 'circle') {
      const circle: Shape = {
        type: 'circle',
        x: this.x,
        y: this.y,
        radius: Math.sqrt(
          Math.pow(e.clientX - this.x, 2) + Math.pow(e.clientY - this.y, 2)
        ),
      };
      this.Shapes.push(circle);
      this.socket.send(
        JSON.stringify({
          type: 'shape',
          shape: {
            roomId: this.roomId,
            data: circle,
          },
        })
      );
    }
    this.refreshCanvas();
  };

  addHandlers() {
    this.canvas!.addEventListener('mousedown', this.mouseDownHandler);
    this.canvas!.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas!.addEventListener('mouseup', this.mouseUpHandler);
  }

  refreshCanvas() {
    this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    this.Shapes.forEach((shape) => {
      if (shape.type === 'rectangle') {
        this.ctx!.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
      if (shape.type === 'circle') {
        this.ctx!.beginPath();
        this.ctx!.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        this.ctx!.stroke();
      }
    });
  }
}
