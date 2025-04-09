import { CanvasClass } from '@/lib/CanvasClass';
import { Mode } from '@/lib/types';
import * as React from 'react';

export interface ICanvasProps {
  setCanvasInstance: React.Dispatch<
    React.SetStateAction<CanvasClass | undefined>
  >;
  mode: Mode;
}

export default function Canvas({ setCanvasInstance, mode }: ICanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current && window) {
      setCanvasInstance(
        new CanvasClass(
          canvasRef.current,
          window.innerWidth,
          window.innerHeight
        )
      );
    }
  }, [setCanvasInstance]);

  return (
    <canvas
      className={mode === 'pan' ? 'cursor-grab' : 'cursor-auto'}
      ref={canvasRef}
    ></canvas>
  );
}
