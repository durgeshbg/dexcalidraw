'use client';
import ChatBox from '@/components/ChatBox';
import HomeComponent from '@/components/HomeComponent';
import Navbar from '@/components/Navbar';
import { SelectedShapeType } from '@/lib/types';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function Room() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const [socket, setSocket] = React.useState<WebSocket | null>(null);

  const [selectedShapeType, setSelectedShapeType] =
    React.useState<SelectedShapeType>('rectangle');

  React.useEffect(() => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_BACKEND_URL}?token=${token}`
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
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-stone-900'>
      <Navbar setSelectedShapeType={setSelectedShapeType} />
      <HomeComponent roomId={roomId} socket={socket} selectedShapeType={selectedShapeType} />
      <ChatBox socket={socket} roomId={roomId} />
    </div>
  );
}
