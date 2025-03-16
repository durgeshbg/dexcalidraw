'use client';
import * as React from 'react';
import Navbar from './Navbar';
import Canvas from './Canvas';
import { CanvasClass } from '@/lib/CanvasClass';
import { SelectedShapeType } from '@/lib/types';

export default function HomeComponent() {
  const [canvasInstance, setCanvasInstance] = React.useState<CanvasClass>();
  const [selectedShapeType, setSelectedShapeType] =
    React.useState<SelectedShapeType>('rectangle');

  if (canvasInstance) {
    canvasInstance.addHandlers();
    canvasInstance.refreshCanvas();
  }

  React.useEffect(() => {
    if (canvasInstance) {
      canvasInstance.setShape(selectedShapeType);
    }
  }, [selectedShapeType]);

  return (
    <div>
      <Navbar
        selectedShapeType={selectedShapeType}
        setSelectedShapeType={setSelectedShapeType}
      />
      <Canvas setCanvasInstance={setCanvasInstance} />
    </div>
  );
}
