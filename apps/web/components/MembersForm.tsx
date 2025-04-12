import * as React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { User } from '@/lib/types';
import { Button } from './ui/button';
import { Plus, Minus } from 'lucide-react';

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
    <DialogContent className='sm:max-w-[500px] bg-gray-900 text-white border border-gray-800 rounded-2xl shadow-xl'>
      <DialogHeader>
        <DialogTitle className='text-lg font-semibold text-white'>
          Manage Members
        </DialogTitle>
      </DialogHeader>

      <div className='grid gap-4 py-2'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='search' className='text-right text-gray-300 text-sm'>
            Search
          </Label>
          <Input
            id='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='col-span-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 text-sm rounded-md'
            placeholder='Search users...'
          />
        </div>
      </div>

      <div className='mt-4 max-h-64 overflow-y-auto space-y-2 pr-1'>
        {users.length === 0 ? (
          <p className='text-gray-500 text-center text-sm'>No users found.</p>
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
                className='flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors duration-150'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-indigo-600 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-sm'>
                    {initials}
                  </div>
                  <span className='text-sm font-medium text-gray-100 truncate'>
                    {user.name}
                  </span>
                </div>
                <Button
                  onClick={() =>
                    isMember ? removeUser(user.id) : addUser(user.id, user.name)
                  }
                  size='icon'
                  variant='ghost'
                  className={`transition-colors duration-200 ${
                    isMember
                      ? 'text-rose-500 hover:text-rose-400'
                      : 'text-gray-400 hover:text-indigo-400'
                  }`}
                >
                  {isMember ? (
                    <Minus className='w-4 h-4' />
                  ) : (
                    <Plus className='w-4 h-4' />
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
