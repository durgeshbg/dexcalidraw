import axios from 'axios';
import { Message, Shape } from '../types/message';
import { Client } from '../types/client';
import dotenv from 'dotenv';

dotenv.config();

const ROOMS_URL = `${process.env.HTTP_BACKEND_URL}/rooms`;

export const pushMessageToDB = async (client: Client, message: Message) => {
  try {
    const response = await axios.post(
      ROOMS_URL + `/${message.roomId}/messages`,
      {
        content: message.content,
        createdAt: message.createdAt,
      },
      {
        headers: {
          Authorization: `Bearer ${client[1]}`,
        },
      }
    );
    console.log('Message sent to HTTP backend', response.data);
  } catch (error) {
    console.error('Error sending message to HTTP backend', error);
  }
};

export const pushShapeToDB = async (client: Client, shape: Shape) => {
  try {
    const response = await axios.post(
      ROOMS_URL + `/${shape.roomId}/shapes`,
      {
        data: shape.data,
      },
      {
        headers: {
          Authorization: `Bearer ${client[1]}`,
        },
      }
    );
    console.log('Shape sent to HTTP backend', response.data);
  } catch (error) {
    console.error('Error sending shape to HTTP backend', error);
  }
};
