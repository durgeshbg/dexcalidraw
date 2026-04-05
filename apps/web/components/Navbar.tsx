'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Mode, MODES, SelectedShapeType, SHAPE_TYPES } from '@/lib/types';
import {
  Square,
  Circle,
  Spline,
  Hand,
  RotateCcw,
  Pencil,
  Undo2,
  Eraser,
  House,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export interface INavbarProps {
  setSelectedShapeType?: React.Dispatch<
    React.SetStateAction<SelectedShapeType>
  >;
  setMode?: React.Dispatch<React.SetStateAction<Mode>>;
  mode?: Mode;
  selectedShapeType?: SelectedShapeType;
  resetScale?: () => void;
  undo?: () => void;
}

const activeToolClass =
  'bg-teal-500/20 text-teal-100 ring-1 ring-teal-400/35 shadow-none';

export default function Navbar({
  selectedShapeType,
  setSelectedShapeType,
  mode,
  setMode,
  resetScale,
  undo,
}: INavbarProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const toolsId = React.useId();

  const shapesMapping = [
    { shape: SHAPE_TYPES[0], label: 'Rectangle', icon: Square },
    { shape: SHAPE_TYPES[1], label: 'Circle', icon: Circle },
    { shape: SHAPE_TYPES[2], label: 'Line', icon: Spline },
  ];

  const modesMapping = [
    { mode: MODES[0], label: 'Draw', icon: Pencil },
    { mode: MODES[1], label: 'Pan', icon: Hand },
    { mode: MODES[2], label: 'Erase', icon: Eraser },
  ];

  return (
    <div
      className={cn(
        'fixed left-3 top-3 z-50 max-w-[calc(100vw-1.5rem)]',
        'rounded-2xl border border-stone-600/50 bg-stone-900/95 text-stone-100 shadow-md backdrop-blur-sm'
      )}
    >
      <div className='flex items-center gap-2 px-3 py-2 justify-between'>
        <span className='text-sm font-semibold tracking-tight text-stone-100'>
          Dexcalidraw
        </span>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 shrink-0 text-stone-400 hover:bg-stone-800 hover:text-stone-100'
          aria-expanded={open}
          aria-controls={toolsId}
          aria-label={open ? 'Collapse toolbar' : 'Expand toolbar'}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown
            className={cn(
              'size-4 transition-transform duration-300 ease-out',
              open && 'rotate-180'
            )}
          />
        </Button>
      </div>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className='min-h-0 overflow-hidden'>
          <div
            id={toolsId}
            className={cn(
              'flex flex-col gap-3 border-t border-stone-700/60 px-3 pb-3 pt-2 transition-opacity duration-300 ease-out',
              open ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            {setSelectedShapeType && (
              <div
                className='flex flex-wrap gap-1.5'
                role='toolbar'
                aria-label='Shapes'
              >
                {shapesMapping.map((s) => {
                  const Icon = s.icon;
                  const isOn = selectedShapeType === s.shape;
                  return (
                    <Button
                      key={s.shape}
                      type='button'
                      variant='ghost'
                      size='icon'
                      disabled={mode === 'pan'}
                      aria-label={s.label}
                      aria-pressed={isOn}
                      className={cn(
                        'size-9 text-stone-300 hover:bg-stone-800 hover:text-stone-100',
                        isOn && activeToolClass
                      )}
                      onClick={() => setSelectedShapeType(s.shape)}
                    >
                      <Icon className='size-4' />
                    </Button>
                  );
                })}
              </div>
            )}

            {setMode && (
              <div
                className={cn(
                  'flex flex-wrap gap-1.5',
                  setSelectedShapeType && 'border-t border-stone-700/60 pt-3'
                )}
                role='toolbar'
                aria-label='Tools'
              >
                {modesMapping.map((m) => {
                  const Icon = m.icon;
                  const isOn = mode === m.mode;
                  return (
                    <Button
                      key={m.mode}
                      type='button'
                      variant='ghost'
                      size='icon'
                      aria-label={m.label}
                      aria-pressed={isOn}
                      className={cn(
                        'size-9 text-stone-300 hover:bg-stone-800 hover:text-stone-100',
                        isOn && activeToolClass
                      )}
                      onClick={() => setMode(m.mode)}
                    >
                      <Icon className='size-4' />
                    </Button>
                  );
                })}
                {resetScale && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    aria-label='Reset zoom'
                    className='size-9 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                    onClick={resetScale}
                  >
                    <RotateCcw className='size-4' />
                  </Button>
                )}
                {undo && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    aria-label='Undo'
                    className='size-9 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                    onClick={undo}
                  >
                    <Undo2 className='size-4' />
                  </Button>
                )}
              </div>
            )}

            <div
              className={cn(
                'flex flex-wrap gap-1.5',
                (setSelectedShapeType || setMode) &&
                  'border-t border-stone-700/60 pt-3'
              )}
            >
              <Button
                type='button'
                variant='ghost'
                size='icon'
                aria-label='Home'
                className='size-9 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                onClick={() => router.push('/')}
              >
                <House className='size-4' />
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                aria-label='Sign out'
                className='size-9 text-stone-400 hover:bg-red-950/40 hover:text-red-300'
                onClick={() => {
                  localStorage.removeItem('dexcalidraw-token');
                  router.push('/signin');
                }}
              >
                <LogOut className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
