'use client';

import { CanvasClass } from '@/lib/CanvasClass';
import { Message, Mode } from '@/lib/types';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ICanvasProps {
  setCanvasInstance: React.Dispatch<
    React.SetStateAction<CanvasClass | undefined>
  >;
  mode: Mode;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function Canvas({
  setCanvasInstance,
  mode,
  setMessages,
}: ICanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current && window) {
      setCanvasInstance(
        new CanvasClass(
          canvasRef.current,
          window.innerWidth,
          window.innerHeight,
          setMessages
        )
      );
    }
  }, [setCanvasInstance, setMessages]);

  return (
    <canvas
      className={cn(
        mode === 'pan' ? 'cursor-grab' : 'cursor-auto',
        'outline-none'
      )}
      ref={canvasRef}
    ></canvas>
  );
}
