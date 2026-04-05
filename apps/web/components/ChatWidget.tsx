import * as React from 'react';
import { DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Minimize2, SendHorizonal, UserPlus } from 'lucide-react';
import { Input } from './ui/input';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface IChatWidgetProps {
  userId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  messages: Message[];
  messagesRef: React.RefObject<HTMLDivElement | null>;
}

const sendBtnClass =
  'shrink-0 rounded-xl bg-teal-600/90 text-white hover:bg-teal-500/90 focus-visible:ring-2 focus-visible:ring-teal-500/40';

function getInitials(name: string) {
  const names = name.split(' ');
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
  return initials.slice(0, 2);
}

export default function ChatWidget({
  userId,
  setIsOpen,
  handleSubmit,
  messages,
  messagesRef,
}: IChatWidgetProps) {
  return (
    <div className='min-h-[300px] w-96 rounded-2xl border border-stone-600/50 bg-stone-900/95 p-2 shadow-sm backdrop-blur-sm transition-colors lg:min-h-[500px]'>
      <div className='flex items-center justify-between border-b border-stone-700/60 p-2'>
        <h2 className='text-sm font-semibold text-stone-100'>Chat</h2>
        <div className='flex gap-1'>
          <DialogTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              aria-label='Manage members'
              className='text-stone-400 transition-colors hover:bg-stone-800 hover:text-teal-200'
            >
              <UserPlus className='size-4' />
            </Button>
          </DialogTrigger>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label='Minimize chat'
            onClick={() => setIsOpen(false)}
            className='text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-100'
          >
            <Minimize2 className='size-4' />
          </Button>
        </div>
      </div>
      <div
        ref={messagesRef}
        className='h-[200px] overflow-y-auto p-2 lg:h-[400px]'
      >
        {messages.map((message) => {
          const isUser = message.author.id === userId;
          const initials = getInitials(message.author.name);
          return (
            <div
              key={message.id}
              className={cn(
                'mb-2 flex items-start gap-2 rounded-md p-2 transition-colors',
                isUser ? 'justify-end text-right' : 'justify-start text-left'
              )}
            >
              {!isUser && (
                <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-600/30 text-xs font-bold text-teal-100 ring-1 ring-teal-500/25'>
                  {initials}
                </div>
              )}
              <div className='max-w-[80%] rounded-md border border-stone-700/40 bg-stone-800/90 p-2 text-stone-100 shadow-sm transition-colors'>
                <p className='text-sm'>{message.content}</p>
              </div>
              {isUser && (
                <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-stone-700 text-sm font-bold text-stone-200'>
                  {initials}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <form className='flex gap-2 p-2' onSubmit={handleSubmit}>
        <Input
          name='message'
          placeholder='Message...'
          className='border-stone-600 bg-stone-950/50 text-stone-100 placeholder:text-stone-500 focus-visible:ring-2 focus-visible:ring-teal-500/40'
        />
        <Button type='submit' size='icon' className={sendBtnClass} aria-label='Send'>
          <SendHorizonal className='size-4' />
        </Button>
      </form>
    </div>
  );
}
