import * as React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { SelectedShapeType } from '@/lib/types';
import { Square, Circle } from 'lucide-react';
export interface INavbarProps {
  selectedShapeType: SelectedShapeType;
  setSelectedShapeType: React.Dispatch<React.SetStateAction<SelectedShapeType>>;
}

export default function Navbar({
  selectedShapeType,
  setSelectedShapeType,
}: INavbarProps) {
  const router = useRouter();

  return (
    <div className='flex justify-between items-center px-4 py-2 border-2 rounded-md fixed top-3 bg-black right-[40%] text-white'>
      <div className='text-xl font-bold mr-5 border-r-2 pr-2'>Dexcalidraw</div>
      <div className='mr-5 border-r-2 pr-2 flex gap-3'>
        <Button onClick={() => setSelectedShapeType('rectangle')}>
          <Square />
        </Button>
        <Button onClick={() => setSelectedShapeType('circle')}>
          <Circle />
        </Button>
      </div>
      <div className='flex space-x-4'>
        <Button
          onClick={() => {
            localStorage.removeItem('dexcalidraw-token');
            router.push('/signin');
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
