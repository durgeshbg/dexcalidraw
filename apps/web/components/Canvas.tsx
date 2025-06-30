import { CanvasClass } from '@/lib/CanvasClass';
import { Message, Mode } from '@/lib/types';
import * as React from 'react';

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
      className={mode === 'pan' ? 'cursor-grab' : 'cursor-auto'}
      ref={canvasRef}
    ></canvas>
  );
}
