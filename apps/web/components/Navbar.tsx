import * as React from 'react';
import { Button } from './ui/button';
import { redirect } from 'next/navigation';
import { Mode, MODES, SelectedShapeType, SHAPE_TYPES } from '@/lib/types';
import { Square, Circle, Hand, PencilIcon, RotateCcw } from 'lucide-react';
export interface INavbarProps {
  setSelectedShapeType?: React.Dispatch<
    React.SetStateAction<SelectedShapeType>
  >;
  setMode?: React.Dispatch<React.SetStateAction<Mode>>;
  mode?: Mode;
  selectedShapeType?: SelectedShapeType;
  resetScale: () => void;
}

export default function Navbar({
  selectedShapeType,
  setSelectedShapeType,
  mode,
  setMode,
  resetScale,
}: INavbarProps) {
  const shapesMapping = [
    { shape: SHAPE_TYPES[0], icon: <Square /> },
    { shape: SHAPE_TYPES[1], icon: <Circle /> },
  ];

  const modesMapping = [
    { mode: MODES[0], icon: <PencilIcon /> },
    { mode: MODES[1], icon: <Hand /> },
  ];

  return (
    <div className='flex justify-between items-center px-4 py-2 border-2 rounded-md fixed top-3 bg-black text-white left-2'>
      <div className='text-xl font-bold mr-5 border-r-2 pr-2'>Dexcalidraw</div>
      {setSelectedShapeType && (
        <div className='mr-5 border-r-2 pr-2 flex gap-3'>
          {shapesMapping.map((s, i) => (
            <Button
              variant={selectedShapeType === s.shape ? 'default' : 'outline'}
              key={i}
              onClick={() => setSelectedShapeType(s.shape)}
              disabled={mode === 'pan'}
            >
              {s.icon}
            </Button>
          ))}
        </div>
      )}
      {setMode && (
        <div className='mr-5 border-r-2 pr-2 flex gap-3'>
          {modesMapping.map((m, i) => (
            <Button
              key={i}
              variant={mode === m.mode ? 'default' : 'outline'}
              onClick={() => setMode(m.mode)}
            >
              {m.icon}
            </Button>
          ))}
          <Button onClick={resetScale}>
            Scale <RotateCcw />
          </Button>
        </div>
      )}
      <div className='flex space-x-4'>
        <Button
          onClick={() => {
            localStorage.removeItem('dexcalidraw-token');
            redirect('/signin');
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
