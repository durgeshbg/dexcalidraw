'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('dexcalidraw-token')) {
      router.push('/signin');
    }
  }, []);

  return <div>Home</div>;
}
