import * as React from 'react';
import { Button } from './ui/button';
import axios, { AxiosError } from 'axios';
import { ChartArea, PlusCircle } from 'lucide-react';
import { Message, User } from '@/lib/types';
import { Input } from './ui/input';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { handleNetworkError } from '@/lib/utils';

export interface IChatBoxProps {
  roomId: string;
}

export default function ChatBox(props: IChatBoxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [memebers, setMembers] = React.useState<User[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    async function fetchMessages() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${props.roomId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('dexcalidraw-token')}`,
          },
        }
      );
      setMessages(res.data.messages);
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${props.roomId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('dexcalidraw-token')}`,
          },
        }
      );
      setMembers(res2.data.room.users);
    }
    fetchMessages();
  }, [props.roomId]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (search) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?s=${search}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('dexcalidraw-token')}`,
            },
          }
        );
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);
  console.log(users);
  console.log(memebers);

  const addUser = async (userId: string, name: string) => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${props.roomId}/users`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers((prev) => [...prev, { id: userId, name }]);
      } catch (error) {
        handleNetworkError(error as AxiosError);
      }
    }
  };
  const removeUser = async (userId: string) => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${props.roomId}/users`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers((prev) => prev.filter((user) => user.id !== userId));
      } catch (error) {
        handleNetworkError(error as AxiosError);
      }
    }
  };

  return (
    <div className='fixed bottom-4 right-2'>
      <Dialog>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Members</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Search
              </Label>
              <Input
                id='search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='col-span-3'
                placeholder='John'
              />
            </div>
          </div>
          <ul className='flex flex-col gap-2 items-center justify-center'>
            {users.map((user: User) => (
              <li className='flex gap-2' key={user.id}>
                {user.name}{' '}
                {memebers.filter((m) => m.id === user.id).length > 0 ? (
                  <Button
                    onClick={() => removeUser(user.id)}
                    className='bg-stone-700'
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    onClick={() => addUser(user.id, user.name)}
                    className='bg-stone-700'
                  >
                    Add
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </DialogContent>

        {isOpen ? (
          <div className='w-96 min-h-[700px] bg-stone-800 rounded-md shadow-md p-2'>
            <div className='flex justify-between items-center p-2 border-b-2 border-stone-700'>
              <h1 className='text-lg font-bold'>Chat</h1>
              <div className='flex gap-2'>
                <DialogTrigger asChild>
                  <Button variant='outline'>
                    Add <PlusCircle />
                  </Button>
                </DialogTrigger>
                <Button onClick={() => setIsOpen(false)}>X</Button>
              </div>
            </div>
            <div className='p-2 overflow-y-auto h-[600px]'>
              {messages.map((message) => (
                <div key={message.id} className='mb-2'>
                  <p className='text-sm font-bold'>{message.author.name}</p>
                  <p className='text-sm'>{message.content}</p>
                </div>
              ))}
            </div>
            <form
              className='flex gap-2 p-2'
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const message = form.message.value;
                await axios.post(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${props.roomId}/messages`,
                  { content: message },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('dexcalidraw-token')}`,
                    },
                  }
                );
                form.reset();
              }}
            >
              <Input
                type='text'
                name='message'
                className='w-full p-2 rounded-md bg-stone-700 text-white'
                placeholder='Type a message...'
              />
              <Button>Send</Button>
            </form>
          </div>
        ) : (
          <Button onClick={() => setIsOpen(true)}>
            <ChartArea />
          </Button>
        )}
      </Dialog>
    </div>
  );
}
