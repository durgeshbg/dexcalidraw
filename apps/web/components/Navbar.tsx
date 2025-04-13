import * as React from 'react';
import { Button } from './ui/button';
import { redirect } from 'next/navigation';
import { Mode, MODES, SelectedShapeType, SHAPE_TYPES } from '@/lib/types';
import {
  Square,
  Circle,
  Hand,
  RotateCcw,
  MousePointer2Icon,
  ChevronsLeftRightEllipsis,
  Undo2,
} from 'lucide-react';

export interface INavbarProps {
  setSelectedShapeType?: React.Dispatch<
    React.SetStateAction<SelectedShapeType>
  >;
  setMode?: React.Dispatch<React.SetStateAction<Mode>>;
  mode?: Mode;
  selectedShapeType?: SelectedShapeType;
  resetScale?: () => void;
  undo?: () => void;
}

export default function Navbar({
  selectedShapeType,
  setSelectedShapeType,
  mode,
  setMode,
  resetScale,
  undo,
}: INavbarProps) {
  const shapesMapping = [
    { shape: SHAPE_TYPES[0], icon: <Square size={20} /> },
    { shape: SHAPE_TYPES[1], icon: <Circle size={20} /> },
    { shape: SHAPE_TYPES[2], icon: <ChevronsLeftRightEllipsis size={20} /> },
  ];

  const modesMapping = [
    { mode: MODES[0], icon: <MousePointer2Icon size={20} /> },
    { mode: MODES[1], icon: <Hand size={20} /> },
  ];

  return (
    <div className='flex justify-between items-center px-4 py-2 border-2 rounded-xl fixed top-3 bg-black text-white left-2 w-auto max-w-full'>
      <div className='text-xl font-bold mr-5 text-blue-500'>Dexcalidraw</div>

      {setSelectedShapeType && (
        <div className='mr-5 flex gap-3'>
          {shapesMapping.map((s, i) => (
            <Button
              key={i}
              variant={selectedShapeType === s.shape ? 'default' : 'outline'}
              onClick={() => setSelectedShapeType(s.shape)}
              disabled={mode === 'pan'}
              className='p-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200'
            >
              {s.icon}
            </Button>
          ))}
        </div>
      )}

      {setMode && (
        <div className='mr-5 flex gap-3 border-l-2 pl-3'>
          {modesMapping.map((m, i) => (
            <Button
              key={i}
              variant={mode === m.mode ? 'default' : 'outline'}
              onClick={() => setMode(m.mode)}
              className='p-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200'
            >
              {m.icon}
            </Button>
          ))}
          <Button
            onClick={resetScale}
            className='p-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200'
          >
            <RotateCcw size={20} /> Zoom
          </Button>
          {undo && (
            <Button
              onClick={undo}
              className='p-2 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200'
            >
              <Undo2 size={20} /> Undo
            </Button>
          )}
        </div>
      )}

      <div className='border-l-2 pl-3 flex gap-3'>
        <Button
          onClick={() => redirect('/')}
          className='px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 text-white focus:ring-2 focus:ring-blue-500 transition duration-200'
        >
          Home
        </Button>
        <Button
          onClick={() => {
            localStorage.removeItem('dexcalidraw-token');
            redirect('/signin');
          }}
          className='px-4 py-2 rounded-md bg-red-500 hover:bg-red-400 text-white focus:ring-2 focus:ring-blue-500 transition duration-200'
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
