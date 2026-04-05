'use client';

import { Room as RoomType } from '@/lib/types';
import * as React from 'react';
import { useRouter } from 'next/navigation';
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

  const goToRoom = () => router.push(`/rooms/${props.room.id}`);

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={goToRoom}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToRoom();
        }
      }}
      className={cn(
        'flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border border-stone-600/50 bg-stone-800/90 px-3 py-2.5 text-stone-100 shadow-sm outline-none transition-colors hover:border-teal-500/30 hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-teal-500/40'
      )}
    >
      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-stone-900/80 text-lg font-semibold text-teal-200'>
        {props.room.name?.[0] ?? '?'}
      </div>
      <span
        className='min-w-0 flex-1 truncate text-left text-sm font-medium text-stone-200'
        title={props.room.name}
      >
        {props.room.name}
      </span>

      {props.displayDelete && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          aria-label='Delete room'
          onClick={handleDelete}
          className='shrink-0 text-stone-400 hover:bg-red-950/40 hover:text-red-300'
        >
          <Trash2 className='size-4' />
        </Button>
      )}
    </div>
  );
}
