'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const AUTH_INPUT_CLASS =
  'border-stone-600 bg-stone-950/50 text-stone-100 placeholder:text-stone-500 focus-visible:ring-2 focus-visible:ring-teal-500/40';

export const AUTH_PRIMARY_BTN =
  'w-full rounded-xl bg-teal-600/90 font-semibold text-white transition-colors hover:bg-teal-500/90 focus-visible:ring-2 focus-visible:ring-teal-500/40';

export const AUTH_LINK =
  'font-medium text-teal-400/90 underline-offset-2 transition-colors hover:text-teal-300';

export const AUTH_OUTLINE_MUTED =
  'w-full border-stone-600 text-stone-300 transition-colors hover:border-teal-500/40 hover:bg-teal-600/10 hover:text-teal-200';

const authCardClass =
  'w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-stone-600/50 bg-stone-900/80 shadow-sm backdrop-blur-sm duration-500';

export function AuthBrand() {
  return (
    <div className='mb-10 flex animate-in fade-in duration-500 items-center gap-4'>
      <h1 className='text-3xl font-semibold tracking-tight text-stone-100'>
        Dexcalidraw
      </h1>
      <div className='flex flex-col text-xs leading-tight text-stone-500'>
        <p>Your</p>
        <p>collaborative</p>
        <p>thinking</p>
        <p>platform</p>
      </div>
    </div>
  );
}

export function AuthCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return <Card className={cn(authCardClass, className)} {...props} />;
}
