'use client';
import * as React from 'react';
import Canvas from './Canvas';
import { CanvasClass } from '@/lib/CanvasClass';
import { Message, Mode } from '@/lib/types';

export default function HomeComponent({
  mode,
  setCanvasInstance,
  setMessages,
}: {
  mode: Mode;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCanvasInstance: React.Dispatch<
    React.SetStateAction<CanvasClass | undefined>
  >;
}) {
  return (
    <div className='w-full animate-in fade-in duration-500'>
      <Canvas
        setMessages={setMessages}
        mode={mode}
        setCanvasInstance={setCanvasInstance}
      />
    </div>
  );
}
