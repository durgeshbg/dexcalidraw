'use client';

import { Room as RoomType } from '@/lib/types';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardTitle, CardFooter } from './ui/card';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

export interface IRoomProps {
  room: RoomType;
  setRooms?: React.Dispatch<React.SetStateAction<RoomType[]>>;
  displayDelete?: boolean;
}

export default function Room(props: IRoomProps) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      const res = await axios.delete(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/rooms/${props.room.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        if (props.setRooms) {
          props.setRooms((prev) =>
            prev.filter((room) => room.id !== props.room.id)
          );
        }
      }
      toast.success('Room deleted successfully');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <Card
        onClick={() => router.push(`/rooms/${props.room.id}`)}
        className={cn(
          'relative flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-stone-600/50 bg-stone-800/90 text-stone-100 shadow-sm transition-transform duration-200 ease-out hover:scale-[1.02] hover:border-teal-500/30 hover:bg-stone-800'
        )}
      >
        <CardTitle className='mt-4 text-6xl font-bold text-teal-200'>
          {props.room.name[0]}
        </CardTitle>
        <CardFooter className='text-center text-sm text-stone-300'>
          {props.room.name}
        </CardFooter>

        {props.displayDelete && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label='Delete room'
            onClick={handleDelete}
            className='absolute right-2 top-2 size-8 text-stone-400 hover:bg-red-950/40 hover:text-red-300'
          >
            <Trash2 className='size-4' />
          </Button>
        )}
      </Card>
    </div>
  );
}
