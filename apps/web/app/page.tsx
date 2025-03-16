'use client';
import HomeComponent from '@/components/HomeComponent';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('dexcalidraw-token')) {
      router.push('/signin');
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-stone-900'>
      <HomeComponent />
    </div>
  );
}
