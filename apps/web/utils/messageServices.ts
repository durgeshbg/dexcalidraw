import { Message, User } from '@/lib/types';
import axios from 'axios';

export async function fetchMessages(roomId: string): Promise<{
  messages: Message[];
  members: User[];
}> {
  const [res, res2] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('dexcalidraw-token')}`,
        },
      }
    ),
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('dexcalidraw-token')}`,
      },
    }),
  ]);

  return {
    messages: res.data.messages,
    members: res2.data.room.users,
  };
}

export async function searchUsers(search: string) {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?s=${search}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('dexcalidraw-token')}`,
      },
    }
  );
  return res.data.users;
}

export async function addUserReq(
  userId: string,
  roomId: string,
  token: string
) {
  await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}/users`,
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function removeUserReq(
  userId: string,
  roomId: string,
  token: string
) {
  await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}/users`,
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
