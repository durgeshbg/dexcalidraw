export type Rectagle = {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Circle = {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
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

export type SelectedShapeType = 'rectangle' | 'circle';
export type Shape = Rectagle | Circle;
