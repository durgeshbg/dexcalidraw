'use client';

import {
  AuthBrand,
  AuthCard,
  AUTH_INPUT_CLASS,
  AUTH_LINK,
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
    <>
      <AuthBrand />

      <AuthCard>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-stone-100'>
              Sign Up
            </CardTitle>
            <CardDescription className='text-sm text-stone-500'>
              Please enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-1.5'>
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
                className={AUTH_INPUT_CLASS}
              />
            </div>

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
                placeholder='you@example.com'
                className={AUTH_INPUT_CLASS}
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
                placeholder='••••••••'
                className={AUTH_INPUT_CLASS}
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col items-start gap-3 pt-2'>
            <Button type='submit' className={AUTH_PRIMARY_BTN}>
              Create Account
            </Button>
            <p className='text-sm text-stone-500'>
              Already have an account?{' '}
              <Link href='/signin' className={AUTH_LINK}>
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </AuthCard>
    </>
  );
}
