'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { handleNetworkError } from '@/lib/utils';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (localStorage.getItem('dexcalidraw-token')) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/users/signup',
        {
          name,
          email,
          password,
        }
      );
      localStorage.setItem('dexcalidraw-token', res.data.token);
      router.push('/');
    } catch (e) {
      handleNetworkError(e as AxiosError);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-black-950 text-white'>
      <div className='flex items-center gap-4 mb-10'>
        <h1 className='text-5xl font-bold tracking-tight text-white drop-shadow-md'>
          Decalidraw
        </h1>
        <div className='flex flex-col leading-tight text-gray-300 text-xs'>
          <p>Your</p>
          <p>collaborative</p>
          <p>thinking</p>
          <p>platform</p>
        </div>
      </div>

      <Card className='w-full max-w-md border border-stone-800 bg-stone-900 shadow-xl rounded-2xl'>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className='text-2xl text-white'>Sign Up</CardTitle>
            <CardDescription className='text-sm text-stone-400'>
              Please enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='name' className='text-sm text-stone-300'>
                Name
              </Label>
              <Input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder='John Doe'
                className='bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>

            <div>
              <Label htmlFor='email' className='text-sm text-stone-300'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='you@example.com'
                className='bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>

            <div>
              <Label htmlFor='password' className='text-sm text-stone-300'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='••••••••'
                className='bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-3 items-start pt-2'>
            <Button
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold'
            >
              Create Account
            </Button>
            <p className='text-sm text-gray-400'>
              Already have an account?{' '}
              <Link
                href='/signin'
                className='text-indigo-400 underline hover:text-indigo-300'
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
