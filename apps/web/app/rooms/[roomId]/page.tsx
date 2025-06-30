'use client';

import ChatBox from '@/components/ChatBox';
import HomeComponent from '@/components/HomeComponent';
import Navbar from '@/components/Navbar';
import { CanvasClass } from '@/lib/CanvasClass';
import { Message, Mode, SelectedShapeType } from '@/lib/types';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function Room() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [canvasInstance, setCanvasInstance] = React.useState<CanvasClass>();

  const [selectedShapeType, setSelectedShapeType] =
    React.useState<SelectedShapeType>('rectangle');
  const [mode, setMode] = React.useState<Mode>('drawing');

  if (canvasInstance) {
    canvasInstance.addHandlers();
    canvasInstance.refreshCanvas();
    canvasInstance.setRoomId(roomId);
    canvasInstance.getShapes();
  }

  const resetScale = () => {
    if (canvasInstance) {
      canvasInstance.resetScale();
    }
  };

  const undoHandler = () => {
    if (canvasInstance) {
      canvasInstance.undo();
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_BACKEND_URL}?token=${token}&roomId=${roomId}`
      );
      ws.onopen = () => {
        setSocket(ws);
      };
    }
    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className='flex flex-col items-center justify-start min-h-screen bg-stone-900'>
      <Navbar
        selectedShapeType={selectedShapeType}
        setSelectedShapeType={setSelectedShapeType}
        mode={mode}
        setMode={setMode}
        resetScale={resetScale}
        undo={undoHandler}
      />

      <HomeComponent
        setMessages={setMessages}
        setCanvasInstance={setCanvasInstance}
        mode={mode}
      />

      <div className='w-full max-w-xs bg-gray-800 rounded-lg shadow-lg'>
        <ChatBox
          messages={messages}
          setMessages={setMessages}
          socket={socket}
          roomId={roomId}
        />
      </div>
    </div>
  );
}
