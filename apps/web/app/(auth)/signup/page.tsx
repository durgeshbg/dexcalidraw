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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-5xl font-bold text-white">Decalidraw</h1>
        <div className="flex flex-col leading-tight text-white text-sm">
          <p>Your</p>
          <p>collaborative</p>
          <p>thinking</p>
          <p>platform</p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border border-gray-800 bg-background">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 items-start">
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link className="underline text-primary" href="/signin">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
