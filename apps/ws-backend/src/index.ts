import WebSocket, { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { verifyToken } from './utils/verifyToken';
import { PasrsedMessageType } from './types/message';
import { getTokenAndRoomIdFromURL } from './utils/getTokenFromURL';
import { addClient, removeClient, sendMessage } from './utils/clientHandlers';
import { Clients, Rooms } from './types/client';
import {
  pushMessageToDB,
  pushShapeToDB,
  deleteShapeFromDB,
} from './services/pushToDB';

dotenv.config();

const app = express();
app.use(cors());

const rooms: Rooms = new Map<string, Clients>();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', async function connection(ws: WebSocket, req) {
  const params = getTokenAndRoomIdFromURL(req.url!);

  if (!params) {
    ws.close(4000, 'Token/Room not provided');
    return;
  }

  const decoded = verifyToken(params.token);

  if (!decoded) {
    ws.close(4001, 'Invalid token');
    return;
  }

  addClient(decoded, rooms, params, ws);

  ws.on('close', () => {
    removeClient(decoded, rooms);
  });

  ws.on('message', function incoming(data) {
    const parsedMessage: PasrsedMessageType = JSON.parse(data.toString());
    const room = rooms.get(parsedMessage.roomId);
    console.log('Message received:', parsedMessage);
    room?.forEach((client) => {
      if (client[0] !== ws) {
        sendMessage(client, parsedMessage);
      }
      if (client[0] === ws) {
        if (parsedMessage.type === 'message') {
          pushMessageToDB(client, parsedMessage.message, parsedMessage.roomId);
        } else if (parsedMessage.type === 'shape') {
          pushShapeToDB(client, parsedMessage.shape, parsedMessage.roomId);
        } else if (parsedMessage.type === 'delete-shape') {
          deleteShapeFromDB(client, parsedMessage.shape, parsedMessage.roomId);
        }
      }
    });
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on: ${process.env.PORT || 8080}`);
});
