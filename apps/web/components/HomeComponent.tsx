'use client';
import * as React from 'react';
import Canvas from './Canvas';
import { CanvasClass } from '@/lib/CanvasClass';
import { SelectedShapeType } from '@/lib/types';

export default function HomeComponent({
  selectedShapeType,
}: {
  selectedShapeType: SelectedShapeType;
}) {
  const [canvasInstance, setCanvasInstance] = React.useState<CanvasClass>();

  if (canvasInstance) {
    canvasInstance.addHandlers();
    canvasInstance.refreshCanvas();
  }

  React.useEffect(() => {
    if (canvasInstance) {
      canvasInstance.setShape(selectedShapeType);
    }
  }, [selectedShapeType, canvasInstance]);

  return (
    <div>
      <Canvas setCanvasInstance={setCanvasInstance} />
    </div>
  );
}
