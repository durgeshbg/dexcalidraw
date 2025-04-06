import { JwtPayload } from 'jsonwebtoken';
import WebSocket from 'ws';
import { PasrsedMessageType } from '../types/message';
import { Client, Clients } from '../types/client';

export const addClient = (
  decoded: JwtPayload,
  clients: Clients,
  token: string,
  ws: WebSocket
) => {
  clients.set(decoded.id, [ws, token]);
  console.log('Client connected:', decoded.id);
};

export const removeClient = (decoded: JwtPayload, clients: Clients) => {
  clients.delete(decoded.id);
  console.log('Client disconnected:', decoded.id);
};

export const sendMessage = (
  client: Client,
  parsedMessage: PasrsedMessageType
) => {
  client[0].send(JSON.stringify(parsedMessage));
  console.log(`Message sent to ${client[1]}`);
};