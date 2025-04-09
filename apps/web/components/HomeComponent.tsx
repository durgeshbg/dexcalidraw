'use client';
import * as React from 'react';
import Canvas from './Canvas';
import { CanvasClass } from '@/lib/CanvasClass';
import { Mode } from '@/lib/types';

export default function HomeComponent({
  mode,
  setCanvasInstance,
}: {
  mode: Mode;
  setCanvasInstance: React.Dispatch<
    React.SetStateAction<CanvasClass | undefined>
  >;
}) {
  return (
    <div>
      <Canvas mode={mode} setCanvasInstance={setCanvasInstance} />
    </div>
  );
}
