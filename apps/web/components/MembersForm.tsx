import * as React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { User } from '@/lib/types';
import { Button } from './ui/button';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IMembersFormProps {
  memebers: User[];
  users: User[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  removeUser: (id: string) => Promise<void>;
  addUser: (id: string, name: string) => Promise<void>;
}

export default function MembersForm({
  memebers,
  users,
  search,
  setSearch,
  removeUser,
  addUser,
}: IMembersFormProps) {
  return (
    <DialogContent className='rounded-2xl border border-stone-600/50 bg-stone-900 text-stone-100 sm:max-w-[500px]'>
      <DialogHeader>
        <DialogTitle className='text-lg font-semibold text-stone-100'>
          Manage Members
        </DialogTitle>
      </DialogHeader>

      <div className='grid gap-4 py-2'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label
            htmlFor='search'
            className='text-right text-sm text-stone-300'
          >
            Search
          </Label>
          <Input
            id='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='col-span-3 rounded-md border border-stone-600 bg-stone-950/50 text-sm text-stone-100 placeholder:text-stone-500 focus-visible:ring-2 focus-visible:ring-teal-500/40'
            placeholder='Search users...'
          />
        </div>
      </div>

      <div className='mt-4 max-h-64 space-y-2 overflow-y-auto pr-1'>
        {users.length === 0 ? (
          <p className='text-center text-sm text-stone-500'>No users found.</p>
        ) : (
          users.map((user: User) => {
            const isMember = memebers.some((m) => m.id === user.id);
            const initials = user.name
              .split(' ')
              .map((word) => word[0]?.toUpperCase())
              .slice(0, 2)
              .join('');

            return (
              <div
                key={user.id}
                className='flex items-center justify-between rounded-lg border border-stone-600/50 bg-stone-800/80 px-3 py-2 transition-colors duration-150 hover:bg-stone-800'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex size-8 items-center justify-center rounded-full bg-teal-600/30 text-xs font-bold text-teal-100 ring-1 ring-teal-500/25'>
                    {initials}
                  </div>
                  <span className='truncate text-sm font-medium text-stone-100'>
                    {user.name}
                  </span>
                </div>
                <Button
                  onClick={() =>
                    isMember ? removeUser(user.id) : addUser(user.id, user.name)
                  }
                  size='icon'
                  variant='ghost'
                  aria-label={isMember ? 'Remove member' : 'Add member'}
                  className={cn(
                    'transition-colors duration-200',
                    isMember
                      ? 'text-rose-400/90 hover:text-red-300'
                      : 'text-stone-400 hover:text-teal-300'
                  )}
                >
                  {isMember ? (
                    <Minus className='size-4' />
                  ) : (
                    <Plus className='size-4' />
                  )}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </DialogContent>
  );
}
