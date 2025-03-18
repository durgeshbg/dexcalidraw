import WebSocket, { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { JwtPayload, verify } from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

type MessageObj = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
  roomId: string;
};

type PasrsedMessageType = { type: 'message'; message: MessageObj };

const clients = new Map<string, [WebSocket, string]>();
const wss = new WebSocketServer({
  port: 8080,
});

wss.on('connection', async function connection(ws: WebSocket, req) {
  const token = req.url?.split('?')[1]?.split('=')[1];

  if (!token) {
    ws.close(4000, 'Token not provided');
    return;
  }
  const decoded = (await verifyToken(token)) as JwtPayload;
  if (!decoded) {
    ws.close(4001, 'Invalid token');
    return;
  }
  if (decoded) {
    console.log('New client connected', decoded);
    clients.set(decoded.id, [ws, token]);
  }

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(decoded.id);
  });

  ws.on('message', function incoming(data) {
    const parsedMessage: PasrsedMessageType = JSON.parse(data.toString());
    clients.forEach((client) => {
      if (client[0] !== ws) {
        client[0].send(JSON.stringify(parsedMessage));
        console.log(`Message sent to ${client[1]}`, parsedMessage);
      }
      if (client[0] === ws) {
        if (parsedMessage.type === 'message') {
          const message = parsedMessage.message;
          axios
            .post(
              process.env.HTTP_BACKEND_URL +
                '/rooms/' +
                message.roomId +
                '/messages',
              {
                content: message.content,
                createdAt: message.createdAt,
              },
              {
                headers: {
                  Authorization: `Bearer ${client[1]}`,
                },
              }
            )
            .then((response) => {
              console.log('Message sent to HTTP backend', response.data);
            })
            .catch((error) => {
              console.error('Error sending message to HTTP backend', error);
            });
        }
      }
    });
  });
});

const verifyToken = async (token: string) => {
  try {
    const decoded = await verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (err) {
    if (err) {
      console.log('Token verification failed', err);
      return false;
    }
  }
};
