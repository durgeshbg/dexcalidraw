import { JwtPayload } from 'jsonwebtoken';
import WebSocket from 'ws';
import { PasrsedMessageType } from '../types/message';
import { Rooms, Client } from '../types/client';

export const addClient = (
  decoded: JwtPayload,
  rooms: Rooms,
  params: { roomId: string; token: string },
  ws: WebSocket
) => {
  const room = rooms.get(params.roomId);
  if (!room) {
    rooms.set(params.roomId, new Map<string, Client>());
  }
  const clients = rooms.get(params.roomId)!;
  clients.set(decoded.id, [ws, params.token]);
  console.log('Client connected:', decoded.id);
};

export const removeClient = (decoded: JwtPayload, rooms: Rooms) => {
  rooms.forEach((clients) => {
    if (clients.has(decoded.id)) {
      clients.delete(decoded.id);
      console.log('Client disconnected:', decoded.id);
    }
  });
};

export const sendMessage = (
  client: Client,
  parsedMessage: PasrsedMessageType
) => {
  client[0].send(JSON.stringify(parsedMessage));
  console.log(`Message sent to ${client[1]}`);
};
