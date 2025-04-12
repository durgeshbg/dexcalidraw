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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-black-950 text-white">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-md">
          Decalidraw
        </h1>
        <div className="flex flex-col leading-tight text-gray-300 text-xs">
          <p>Your</p>
          <p>collaborative</p>
          <p>thinking</p>
          <p>platform</p>
        </div>
      </div>

      <Card className="w-full max-w-md border border-stone-800 bg-stone-900 shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl text-white">Sign In</CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Please enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-stone-800 border border-stone-700 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-stone-800 border border-stone-700 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </CardContent>

          <CardContent className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              onClick={() => {
                setEmail('koji.walters@gmail.com');
                setPassword('123456789');
              }}
              variant="outline"
              className="w-full border-stone-700 hover:border-indigo-500 hover:text-indigo-400 transition"
            >
              Test Credentials 1
            </Button>
            <Button
              type="button"
              onClick={() => {
                setEmail('cheng.sokolov294@gmail.com');
                setPassword('123456789');
              }}
              variant="outline"
              className="w-full border-stone-700 hover:border-indigo-500 hover:text-indigo-400 transition"
            >
              Test Credentials 2
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 items-start pt-2">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold"
            >
              Sign In
            </Button>
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
