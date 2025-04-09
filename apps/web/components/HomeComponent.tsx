'use client';
import * as React from 'react';
import Canvas from './Canvas';
import { CanvasClass } from '@/lib/CanvasClass';
import { Mode, SelectedShapeType } from '@/lib/types';

export default function HomeComponent({
  selectedShapeType,
  roomId,
  socket,
  mode,
}: {
  selectedShapeType: SelectedShapeType;
  roomId: string;
  socket: WebSocket | null;
  mode: Mode;
}) {
  const [canvasInstance, setCanvasInstance] = React.useState<CanvasClass>();

  if (canvasInstance) {
    canvasInstance.addHandlers();
    canvasInstance.refreshCanvas();
    canvasInstance.setRoomId(roomId);
    canvasInstance.getShapes();
  }

  React.useEffect(() => {
    if (socket) {
      canvasInstance?.setSocket(socket);
    }
  }, [socket, canvasInstance]);

  React.useEffect(() => {
    if (canvasInstance) {
      canvasInstance.setShape(selectedShapeType);
      canvasInstance?.setMode(mode);
    }
  }, [selectedShapeType, canvasInstance, mode]);

  return (
    <div>
      <Canvas mode={mode} setCanvasInstance={setCanvasInstance} />
    </div>
  );
}
