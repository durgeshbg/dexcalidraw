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

  const [selectedShapeType, setSelectedShapeType] =
    React.useState<SelectedShapeType>('rectangle');

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-stone-900'>
      <Navbar setSelectedShapeType={setSelectedShapeType} />
      <HomeComponent selectedShapeType={selectedShapeType} />
      <ChatBox roomId={roomId} />
    </div>
  );
}
