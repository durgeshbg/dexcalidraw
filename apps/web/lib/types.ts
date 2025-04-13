export type Rectagle = {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  uuid?: string;
};

export type Circle = {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  uuid?: string;
};

export type Line = {
  type: 'line';
  x: number;
  y: number;
  x2: number;
  y2: number;
  uuid?: string;
};

export type Room = {
  id: string;
  name: string;
  createdAt: Date;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
};

export type User = {
  name: string;
  id: string;
};

export const SHAPE_TYPES = ['rectangle', 'circle', 'line'] as const;
export type SelectedShapeType = (typeof SHAPE_TYPES)[number];

export const MODES = ['drawing', 'pan'] as const;
export type Mode = (typeof MODES)[number];

export type ViewPort = { x: number; y: number; scale: number };
export type Shape = Rectagle | Circle | Line;

export type PasrsedMessageType = { type: 'message'; message: Message };
