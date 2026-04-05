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
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return;
    }

    let instance: CanvasClass | undefined;

    const syncSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) {
        return;
      }
      if (instance) {
        instance.resize(w, h);
      } else {
        instance = new CanvasClass(canvas, w, h, setMessages);
        setCanvasInstance(instance);
      }
    };

    syncSize();
    const ro = new ResizeObserver(() => syncSize());
    ro.observe(container);

    return () => {
      ro.disconnect();
      instance?.destroy();
      setCanvasInstance(undefined);
    };
  }, [setCanvasInstance, setMessages]);

  return (
    <div
      ref={containerRef}
      className='h-full min-h-0 w-full'
    >
      <canvas
        className={cn(
          mode === 'pan' ? 'cursor-grab' : 'cursor-auto',
          'block h-full w-full touch-none outline-none'
        )}
        ref={canvasRef}
      />
    </div>
  );
}
