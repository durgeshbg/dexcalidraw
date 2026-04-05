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

const panelClass =
  'rounded-2xl border border-stone-600/50 bg-stone-900/80 p-6 shadow-sm backdrop-blur-sm';

const primaryBtnClass =
  'rounded-xl bg-teal-600/90 text-white hover:bg-teal-500/90 focus-visible:ring-2 focus-visible:ring-teal-500/40';

export default function Home() {
  const [rooms, setRooms] = React.useState<RoomType[]>([]);
  const [adminRooms, setAdminRooms] = React.useState<RoomType[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      const fetchRooms = async () => {
        try {
          const res = await axios.get(
            process.env.NEXT_PUBLIC_BACKEND_URL + '/users/me',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const adminRoomsIds = res.data.adminRooms.map(
            (room: RoomType) => room.id
          );
          setRooms(
            res.data.rooms.filter(
              (room: RoomType) => !adminRoomsIds.includes(room.id)
            )
          );
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
        setDialogOpen(false);
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

      <div className='min-h-screen bg-stone-900 text-stone-100'>
        <div className='mx-auto max-w-6xl px-4 pb-10 pt-20'>
          <h1 className='mb-10 text-center text-3xl font-semibold tracking-tight text-stone-100'>
            Your Rooms
          </h1>

          <div className='grid gap-6 lg:grid-cols-2 lg:items-start'>
            <div className={panelClass}>
              <h2 className='mb-4 text-center text-lg font-medium text-stone-200'>
                As a Member
              </h2>
              {rooms.length > 0 ? (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {rooms.map((room: RoomType) => (
                    <Room
                      displayDelete={false}
                      key={room.id}
                      room={room}
                      setRooms={setRooms}
                    />
                  ))}
                </div>
              ) : (
                <p className='text-center text-stone-500'>
                  You&apos;re not in any rooms as a member.
                </p>
              )}
            </div>

            <div className={panelClass}>
              <h2 className='mb-4 text-center text-lg font-medium text-stone-200'>
                As an Admin
              </h2>
              {adminRooms.length > 0 ? (
                <div className='grid max-h-96 min-h-0 gap-2 overflow-y-auto overscroll-contain sm:grid-cols-2'>
                  {adminRooms.map((room: RoomType) => (
                    <Room
                      displayDelete={true}
                      key={room.id}
                      room={room}
                      setRooms={setAdminRooms}
                    />
                  ))}
                </div>
              ) : (
                <p className='text-center text-stone-500'>
                  You&apos;re not an admin of any rooms yet.
                </p>
              )}
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={`mt-6 flex items-center px-4 py-2 ${primaryBtnClass}`}
              >
                <PlusIcon className='mr-2 h-5 w-5' />
                Create Room
              </Button>
            </DialogTrigger>

            <DialogContent className='border-stone-600/50 bg-stone-900 text-stone-100'>
              <DialogTitle className='text-stone-100'>Create a Room</DialogTitle>
              <form onSubmit={handleCreateRoom} className='space-y-6'>
                <div>
                  <Input
                    type='text'
                    name='roomName'
                    placeholder='Enter Room Name'
                    required
                    className='w-full rounded-lg border border-stone-600 bg-stone-950/50 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus-visible:ring-2 focus-visible:ring-teal-500/40'
                  />
                </div>

                <DialogFooter>
                  <Button
                    type='submit'
                    className={`w-full px-6 py-3 text-base font-semibold ${primaryBtnClass}`}
                  >
                    Create Room
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
