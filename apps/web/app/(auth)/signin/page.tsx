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

export default function SignIn() {
  const router = useRouter();
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
        process.env.NEXT_PUBLIC_BACKEND_URL + '/users/signin',
        {
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
    <div>
      <h1 className='text-3xl text-center mt-32'>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <Card className='w-[450px] mx-auto mt-10 shadow-lg'>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Please enter your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Label>
              Email:
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                name='email'
              />
            </Label>
            <br />
            <Label>
              Password:
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                name='password'
              />
            </Label>
          </CardContent>
          <CardContent>
            <Button type='submit'>Submit</Button>
          </CardContent>
          <br />
          <CardFooter>
            <p className='text-gray-500'>
              Don&apos;t have an account?{' '}
              <Link className='font-bold underline' href='/signup'>
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
