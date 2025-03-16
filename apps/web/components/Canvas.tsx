import { CanvasClass } from '@/lib/CanvasClass';
import * as React from 'react';

export interface ICanvasProps {
  setCanvasInstance: React.Dispatch<
    React.SetStateAction<CanvasClass | undefined>
  >;
}

export default function Canvas({
  setCanvasInstance,
}: ICanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current && window !== undefined) {
      setCanvasInstance(
        new CanvasClass(
          canvasRef.current,
          window.innerWidth,
          window.innerHeight
        )
      );
    }
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
