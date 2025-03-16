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

export type SelectedShapeType = 'rectangle' | 'circle';
export type Shape = Rectagle | Circle;
