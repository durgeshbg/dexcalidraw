'use client';

import Navbar from '@/components/Navbar';
import RedirectIfNotAuth from '@/components/RedirectIfNotAuth';
import Room from '@/components/Room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Room as RoomType } from '@/lib/types';
import { handleNetworkError } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Home() {
  const [rooms, setRooms] = React.useState<RoomType[]>([]);
  const [adminRooms, setAdminRooms] = React.useState<RoomType[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false); // Track dialog open state

  React.useEffect(() => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      const fetchRooms = async () => {
        try {
          const res = await axios.get(
            process.env.NEXT_PUBLIC_BACKEND_URL + '/users/me',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRooms(res.data.rooms);
          setAdminRooms(res.data.adminRooms);
        } catch (e) {
          handleNetworkError(e as AxiosError);
        }
      };
      fetchRooms();
    }
  }, []);

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      const roomName = (e.target as HTMLFormElement).roomName.value;
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/rooms',
          { name: roomName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdminRooms((prev) => [...prev, res.data.room]);
        setDialogOpen(false); // Close the dialog on success
        (e.target as HTMLFormElement).reset();
      } catch (e) {
        handleNetworkError(e as AxiosError);
      }
    }
  };

  return (
    <>
      <RedirectIfNotAuth />
      <Navbar />

      <div className='max-w-6xl mx-auto px-4 py-10'>
        <h1 className='text-4xl font-bold text-center mb-14'>Your Rooms</h1>

        <div className='space-y-10'>
          <div className='rounded-2xl border border-muted bg-background p-6 shadow-md'>
            <h2 className='text-2xl font-semibold text-center mb-4'>
              As a Member
            </h2>
            {rooms.length > 0 ? (
              <div className='flex flex-wrap gap-4 justify-center'>
                {rooms.map((room: RoomType) => (
                  <Room key={room.id} room={room} setRooms={setRooms} />
                ))}
              </div>
            ) : (
              <p className='text-center text-muted-foreground'>
                You&apos;re not in any rooms as a member.
              </p>
            )}
          </div>

          <div className='rounded-2xl border border-muted bg-background p-6 shadow-md'>
            <h2 className='text-2xl font-semibold text-center mb-4'>
              As an Admin
            </h2>
            {adminRooms.length > 0 ? (
              <div className='flex flex-wrap gap-4 justify-center max-h-96 overflow-y-auto'>
                {adminRooms.map((room: RoomType) => (
                  <Room key={room.id} room={room} setRooms={setAdminRooms} />
                ))}
              </div>
            ) : (
              <p className='text-center text-muted-foreground'>
                You&apos;re not an admin of any rooms yet.
              </p>
            )}
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md mt-6'>
              <PlusIcon className='h-5 w-5 mr-2' />
              Create Room
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Create a Room</DialogTitle>
            <form onSubmit={handleCreateRoom} className='space-y-6'>
              <div>
                <Input
                  type='text'
                  name='roomName'
                  placeholder='Enter Room Name'
                  required
                  className='w-full px-5 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out'
                />
              </div>

              <DialogFooter>
                <Button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out'
                >
                  Create Room
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
