'use client';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function RedirectIfNotAuth() {
  const router = useRouter();
  React.useEffect(() => {
    if (!localStorage.getItem('dexcalidraw-token')) {
      router.push('/signin');
    }
  }, []);
  return null;
}
