import * as React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { User } from '@/lib/types';
import { Button } from './ui/button';
import { CircleMinus, CirclePlus } from 'lucide-react';

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
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle className='text-gray-100'>Add Members</DialogTitle>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='name' className='text-right text-gray-200'>
            Search
          </Label>
          <Input
            id='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='col-span-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500'
            placeholder='John'
          />
        </div>
      </div>
      <ul className='flex flex-wrap gap-2 items-center justify-center'>
        {users.map((user: User) => (
          <li
            className='flex items-center gap-2 border-2 border-gray-600 px-2 py-1 rounded-sm bg-gray-800'
            key={user.id}
          >
            {user.name}{' '}
            {memebers.filter((m) => m.id === user.id).length > 0 ? (
              <Button
                onClick={() => removeUser(user.id)}
                className='bg-gray-700 text-gray-300 hover:bg-gray-600'
              >
                <CircleMinus />
              </Button>
            ) : (
              <Button
                onClick={() => addUser(user.id, user.name)}
                className='bg-gray-700 text-gray-300 hover:bg-gray-600'
              >
                <CirclePlus />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </DialogContent>
  );
}
