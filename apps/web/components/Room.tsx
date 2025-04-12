import { Room as RoomType } from '@/lib/types';
import * as React from 'react';
import { Card, CardTitle, CardFooter } from './ui/card';
import { redirect } from 'next/navigation';
import { DeleteIcon } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface IRoomProps {
  room: RoomType;
  setRooms?: React.Dispatch<React.SetStateAction<RoomType[]>>;
  displayDelete?: boolean;
}

export default function Room(props: IRoomProps) {
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
        onClick={() => redirect(`/rooms/${props.room.id}`)}
        className='w-48 h-48 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out shadow-md cursor-pointer relative'
      >
        <CardTitle className='text-6xl font-bold mt-4'>
          {props.room.name[0]}
        </CardTitle>
        <CardFooter className='text-sm text-center'>
          {props.room.name}
        </CardFooter>

        {props.displayDelete && (
          <Button
            onClick={handleDelete}
            className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200 ease-in-out'
          >
            <DeleteIcon className='w-4 h-4' />
          </Button>
        )}
      </Card>
    </div>
  );
}
