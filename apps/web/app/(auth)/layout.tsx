import * as React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-stone-900 px-4 py-8 text-stone-100'>
      {children}
    </div>
  );
}
