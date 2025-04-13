export type Message = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
  roomId: string;
};

export type Shape = {
  data: any;
  roomId: string;
};

export type PasrsedMessageType =
  | { type: 'message'; roomId: string; message: Message }
  | { type: 'shape'; roomId: string; shape: Shape }
  | { type: 'delete-shape'; roomId: string; shape: Shape };
