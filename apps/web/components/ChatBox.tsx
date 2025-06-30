import * as React from 'react';
import { Button } from './ui/button';
import { AxiosError } from 'axios';
import { MessageSquareQuote } from 'lucide-react';
import { Message, User } from '@/lib/types';

import { Dialog } from '@/components/ui/dialog';
import { handleNetworkError } from '@/lib/utils';
import { decode } from 'jsonwebtoken';
import {
  addUserReq,
  fetchMessages,
  removeUserReq,
  searchUsers,
} from '@/utils/messageServices';
import ChatWidget from './ChatWidget';
import MembersForm from './MembersForm';
import { toast } from 'react-toastify';

export interface IChatBoxProps {
  roomId: string;
  socket: WebSocket | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatBox(props: IChatBoxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [memebers, setMembers] = React.useState<User[]>([]);
  const [search, setSearch] = React.useState<string>('a');
  const [users, setUsers] = React.useState<User[]>([]);
  const messagesRef = React.useRef<HTMLDivElement>(null);
  const [userId, setUserId] = React.useState<string>('');
  const [userName, setUserName] = React.useState<string>('');

  React.useEffect(() => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      decode(token, { complete: true });
      const decoded = decode(token) as { id: string };
      setUserId(decoded.id);
    }
  }, []);

  React.useEffect(() => {
    if (messagesRef.current && isOpen) {
      messagesRef.current.scrollBy({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [isOpen, props.messages]);

  React.useEffect(() => {
    (async () => {
      const { messages, members } = await fetchMessages(props.roomId);
      props.setMessages(messages);
      setMembers(members);
    })();
  }, [props.roomId]);

  React.useEffect(() => {
    if (memebers.length > 0 && userId) {
      const user = memebers.find((m: User) => m.id === userId);
      if (user) {
        setUserName(user.name);
      }
    }
  }, [memebers, userId]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (search) {
        const users = await searchUsers(search);
        setUsers(users);
      } else {
        setUsers([]);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const addUser = async (userId: string, name: string) => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      try {
        await addUserReq(userId, props.roomId, token);
        setMembers((prev) => [...prev, { id: userId, name }]);
        toast.success('User added successfully');
      } catch (error) {
        handleNetworkError(error as AxiosError);
      }
    }
  };
  const removeUser = async (userId: string) => {
    const token = localStorage.getItem('dexcalidraw-token');
    if (token) {
      try {
        await removeUserReq(userId, props.roomId, token);
        setMembers((prev) => prev.filter((user) => user.id !== userId));
        toast.success('User removed successfully');
      } catch (error) {
        handleNetworkError(error as AxiosError);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const message = form.message.value;
    const messageId = Math.random().toString();
    const messageObj: Message = {
      id: messageId,
      content: message,
      createdAt: new Date(),
      author: {
        id: userId,
        name: userName,
      },
    };
    if (props.socket) {
      props.socket.send(
        JSON.stringify({
          type: 'message',
          message: messageObj,
          roomId: props.roomId,
        })
      );
    }
    props.setMessages((prev) => [...prev, messageObj]);
    form.reset();
  };

  return (
    <div className='fixed bottom-4 right-2'>
      <Dialog>
        <MembersForm
          memebers={memebers}
          users={users}
          search={search}
          setSearch={setSearch}
          removeUser={removeUser}
          addUser={addUser}
        />

        {isOpen ? (
          <ChatWidget
            userId={userId}
            handleSubmit={handleSubmit}
            setIsOpen={setIsOpen}
            messages={props.messages}
            messagesRef={messagesRef}
          />
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            className='bg-indigo-600 text-white hover:bg-indigo-500 rounded-full p-3 shadow-lg'
          >
            <MessageSquareQuote />
          </Button>
        )}
      </Dialog>
    </div>
  );
}
