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
  | { type: 'message'; message: Message }
  | { type: 'shape'; shape: Shape };
