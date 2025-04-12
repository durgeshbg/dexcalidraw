import * as React from 'react';
import { DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Minimize2, SendHorizonal, UserPlus } from 'lucide-react';
import { Input } from './ui/input';
import { Message } from '@/lib/types';

export interface IChatWidgetProps {
  userId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  messages: Message[];
  messagesRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatWidget({
  userId,
  setIsOpen,
  handleSubmit,
  messages,
  messagesRef,
}: IChatWidgetProps) {
  return (
    <div className='w-96 min-h-[700px] bg-gray-800 rounded-md shadow-md p-2'>
      <div className='flex justify-between items-center p-2 border-b-2 border-gray-700'>
        <h1 className='text-lg font-bold text-gray-100'>Chat</h1>
        <div className='flex gap-2'>
          <DialogTrigger asChild>
            <Button variant='outline' className='text-gray-300'>
              <UserPlus />
            </Button>
          </DialogTrigger>
          <Button
            onClick={() => setIsOpen(false)}
            className='bg-gray-700 text-gray-300 hover:bg-gray-600'
          >
            <Minimize2 />
          </Button>
        </div>
      </div>
      <div ref={messagesRef} className='p-2 overflow-y-auto h-[600px]'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-md ${
              message.author.id === userId ? 'text-right' : 'text-left'
            } bg-gray-700 text-white shadow-md`}
          >
            <p className='text-sm font-semibold'>{message.author.name}</p>
            <p className='text-sm'>{message.content}</p>
          </div>
        ))}
      </div>
      <form className='flex gap-2 p-2' onSubmit={handleSubmit}>
        <Input
          name='message'
          placeholder='Message...'
          className='bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500'
        />
        <Button
          type='submit'
          className='bg-indigo-600 hover:bg-indigo-500 text-white'
        >
          <SendHorizonal />
        </Button>
      </form>
    </div>
  );
}
