import * as React from 'react';
import { Button } from './ui/button';
import axios, { AxiosError } from 'axios';
import { ChartArea, PlusCircle } from 'lucide-react';
import { Message, PasrsedMessageType, User } from '@/lib/types';
import { Input } from './ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { handleNetworkError } from '@/lib/utils';
import { decode } from 'jsonwebtoken';

export interface IChatBoxProps {
  roomId: string;
  socket: WebSocket | null;
}

export default function ChatBox(props: IChatBoxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [memebers, setMembers] = React.useState<User[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const [users, setUsers] = React.useState<User[]>([]);
  const messagesRef = React.useRef<HTMLDivElement>(null);
  const [userId, setUserId] = React.useState<string>('');
  const [userName, setUserName] = React.useState<string>('');

  React.useEffect(() => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      decode(token, { complete: true });
      const decoded = decode(token) as { id: string };
      setUserId(decoded.id);
    }
  }, []);

  React.useEffect(() => {
    if (messagesRef.current && isOpen) {
      messagesRef.current.scrollBy({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [isOpen, messages]);

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
    if (memebers.length > 0 && userId) {
      const user = memebers.find((m: User) => m.id === userId);
      if (user) {
        setUserName(user.name);
      }
    }
  }, [memebers, userId]);

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

  React.useEffect(() => {
    if (props.socket && isOpen) {
      props.socket.onmessage = (event) => {
        const data: PasrsedMessageType = JSON.parse(event.data.toString());
        console.log(data);

        if (data.type === 'message') {
          if (data.message) {
            setMessages((prev) => [...prev, data.message]);
          }
        }
      };
    }
  }, [isOpen, props.socket]);

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
            <div ref={messagesRef} className='p-2 overflow-y-auto h-[600px]'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 p-2 rounded-md ${
                    message.author.id === userId ? 'text-right' : 'text-left'
                  } bg-stone-700 text-white shadow-md`}
                >
                  <p className='text-sm text-bold'>{message.author.name}</p>
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
                const messageId = Math.random().toString();
                const messageObj: Message = {
                  id: messageId,
                  content: message,
                  createdAt: new Date(),
                  author: {
                    id: userId,
                    name: userName,
                  },
                  roomId: props.roomId,
                };
                if (props.socket) {
                  props.socket.send(
                    JSON.stringify({
                      type: 'message',
                      message: messageObj,
                    })
                  );
                }
                setMessages((prev) => [...prev, messageObj]);
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
