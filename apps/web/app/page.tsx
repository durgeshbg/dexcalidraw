'use client';
import Navbar from '@/components/Navbar';
import RedirectIfNotAuth from '@/components/RedirectIfNotAuth';
import Room from '@/components/Room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Room as RoomType } from '@/lib/types';
import { handleNetworkError } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import * as React from 'react';

export default function Home() {
  const [rooms, setRooms] = React.useState<RoomType[]>([]);
  const [adminRooms, setAdminRooms] = React.useState<RoomType[]>([]);

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
        (e.target as HTMLFormElement).reset();
      } catch (e) {
        handleNetworkError(e as AxiosError);
      }
    }
  };

  return (
    <>
      <RedirectIfNotAuth />
      <Navbar setSelectedShapeType={null} />
      <div>
        <h1 className='text-4xl text-center mt-20'>Rooms</h1>
        <div className='flex flex-col'>
          <div className='border mt-10 p-5 mx-5 rounded-sm'>
            <div className='text-xl text-center mt-2'>As a member</div>
            <div className='flex gap-5 mx-auto items-center justify-center flex-wrap mt-4'>
              {rooms.length > 0 ? (
                rooms.map((room: RoomType) => (
                  <Room setRooms={setRooms} key={room.id} room={room} />
                ))
              ) : (
                <div className='text-center'>
                  <div>No rooms you are in as member.</div>
                </div>
              )}
            </div>
          </div>
          <div className='border mt-10 p-5 mx-5 rounded-sm'>
            <div className='text-xl text-center mt-2'>As a Admin</div>
            <div className='flex gap-5 mx-auto items-center justify-center flex-wrap mt-4'>
              {adminRooms.length > 0 ? (
                adminRooms.map((room: RoomType) => (
                  <Room setRooms={setAdminRooms} key={room.id} room={room} />
                ))
              ) : (
                <div className='text-center'>
                  <div>No rooms you are in as admin.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='mx-auto text-center mt-10'>
          <div className='text-center'>Create a new room</div>
          <form onSubmit={handleCreateRoom}>
            <Input
              type='text'
              name='roomName'
              placeholder='Room Name'
              className='w-1/2 mx-auto mt-5'
            />
            <Button
              type='submit'
              className='bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md mt-5'
            >
              Create Room
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
