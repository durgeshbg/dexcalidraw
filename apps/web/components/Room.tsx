import { Room as RoomType } from '@/lib/types';
import * as React from 'react';
import { Card } from './ui/card';
import { redirect } from 'next/navigation';
import { DeleteIcon } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface IRoomProps {
  room: RoomType;
  setRooms?: React.Dispatch<React.SetStateAction<RoomType[]>>;
}

export default function Room(props: IRoomProps) {
  const handleDelete = async () => {
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
        onClick={() => redirect(`/rooms/${props.room.id}`)}
        className='w-52 h-52 flex items-center justify-center bg-stone-900 text-white text-xl hover:bg-stone-800 cursor-pointer'
      >
        {props.room.name}
      </Card>
      <Button onClick={handleDelete} className='bg-red-500 hover:bg-red-600'>
        <DeleteIcon className='size-5 text-white' />
      </Button>
    </div>
  );
}
