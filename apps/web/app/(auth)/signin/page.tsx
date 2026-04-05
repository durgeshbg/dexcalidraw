'use client';

import {
  AuthBrand,
  AuthCard,
  AUTH_INPUT_CLASS,
  AUTH_LINK,
  AUTH_OUTLINE_MUTED,
  AUTH_PRIMARY_BTN,
} from '@/components/auth/auth-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
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
    <>
      <AuthBrand />

      <AuthCard>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-stone-100'>
              Sign In
            </CardTitle>
            <CardDescription className='text-sm text-stone-500'>
              Please enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='email' className='text-sm text-stone-300'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={AUTH_INPUT_CLASS}
                placeholder='you@example.com'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='password' className='text-sm text-stone-300'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={AUTH_INPUT_CLASS}
                placeholder='••••••••'
              />
            </div>
          </CardContent>

          <CardContent className='flex flex-col gap-3 pt-2 sm:flex-row'>
            <Button
              type='button'
              onClick={() => {
                setEmail('claudia.collins100@gmail.com');
                setPassword('123456789');
              }}
              variant='outline'
              className={AUTH_OUTLINE_MUTED}
            >
              Test Credentials 1
            </Button>
            <Button
              type='button'
              onClick={() => {
                setEmail('xolani.tomaszewski@gmail.com');
                setPassword('123456789');
              }}
              variant='outline'
              className={AUTH_OUTLINE_MUTED}
            >
              Test Credentials 2
            </Button>
          </CardContent>

          <CardFooter className='flex flex-col items-start gap-3 pt-2'>
            <Button type='submit' className={AUTH_PRIMARY_BTN}>
              Sign In
            </Button>
            <p className='text-sm text-stone-500'>
              Don&apos;t have an account?{' '}
              <Link href='/signup' className={AUTH_LINK}>
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </AuthCard>
    </>
  );
}
