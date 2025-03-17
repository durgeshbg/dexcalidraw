import * as React from 'react';
import { Button } from './ui/button';
import { redirect } from 'next/navigation';
import { SelectedShapeType } from '@/lib/types';
import { Square, Circle } from 'lucide-react';
export interface INavbarProps {
  setSelectedShapeType: React.Dispatch<
    React.SetStateAction<SelectedShapeType>
  > | null;
}

export default function Navbar({ setSelectedShapeType }: INavbarProps) {
  return (
    <div className='flex justify-between items-center px-4 py-2 border-2 rounded-md fixed top-3 bg-black text-white left-2'>
      <div className='text-xl font-bold mr-5 border-r-2 pr-2'>Dexcalidraw</div>
      {setSelectedShapeType && (
        <div className='mr-5 border-r-2 pr-2 flex gap-3'>
          <Button onClick={() => setSelectedShapeType('rectangle')}>
            <Square />
          </Button>
          <Button onClick={() => setSelectedShapeType('circle')}>
            <Circle />
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
