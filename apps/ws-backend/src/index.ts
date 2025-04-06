import WebSocket, { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { verifyToken } from './utils/verifyToken';
import { Message, PasrsedMessageType, Shape } from './types/message';
import { getTokenFromURL } from './utils/getTokenFromURL';
import { addClient, removeClient, sendMessage } from './utils/clientHandlers';
import { Client } from './types/client';
import { pushMessageToDB, pushShapeToDB } from './services/pushToDB';

dotenv.config();

const app = express();
app.use(cors());

const clients = new Map<string, Client>();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', async function connection(ws: WebSocket, req) {
  const token = getTokenFromURL(req.url!);

  if (!token) {
    ws.close(4000, 'Token not provided');
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    ws.close(4001, 'Invalid token');
    return;
  }

  addClient(decoded, clients, token, ws);

  ws.on('close', () => {
    removeClient(decoded, clients);
  });

  ws.on('message', function incoming(data) {
    const parsedMessage: PasrsedMessageType = JSON.parse(data.toString());

    clients.forEach((client) => {
      if (client[0] !== ws) {
        sendMessage(client, parsedMessage);
      }
      if (client[0] === ws) {
        if (parsedMessage.type === 'message') {
          pushMessageToDB(client, parsedMessage.message);
        } else if (parsedMessage.type === 'shape') {
          pushShapeToDB(client, parsedMessage.shape);
        }
      }
    });
  });
});

server.listen(8080, () => {
  console.log(`Server running on: 8080`);
});
