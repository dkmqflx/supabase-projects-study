'use client';

import { Button, Spinner } from '@material-tailwind/react';
import Person from './Person';
import Message from './Message';
import { useRecoilValue } from 'recoil';
import {
  presenceState,
  selectedUserIdState,
  selectedUserIndexState,
} from 'utils/recoil/atoms';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllMessages, getUserById, sendMessage } from 'actions/chatActions';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export default function ChatScreen({}) {
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);

  const [message, setMessage] = useState('');

  const supabase = createBrowserSupabaseClient();
  const presence = useRecoilValue(presenceState);

  const selectedUserQuery = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => getUserById(selectedUserId),
  });

  // 메세지 보내는 mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      return sendMessage({
        message,
        chatUserId: selectedUserId,
      });
    },

    onSuccess: () => {
      setMessage(''); // 기존의 메세지는 초기화
      getAllMessagesQuery.refetch();
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ['messages', selectedUserId],
    queryFn: () => getAllMessages({ chatUserId: selectedUserId }),
  });

  // 상대방이 메시지를 보냈을 때 내 채팅창에서 해당 메세지가 보일 수 있도록 하는 기능
  useEffect(() => {
    // channel의 역할은 어떤 채널에서 이벤트를 들을 것인지 지정해주는 부분
    // 이름은 아무거나 지어도 된다
    const channel = supabase
      .channel('message_postgres_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && !payload.errors) {
            // 메세지가 들어오면 query를 refetch 한다.
            getAllMessagesQuery.refetch();
          }
        }
      )
      .subscribe(); // subscribe를 해주어야 한다.

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return selectedUserQuery.data !== null ? (
    <div className="w-full h-screen flex flex-col">
      {/* Active 유저 영역 */}
      <Person
        index={selectedUserIndex}
        isActive={false}
        name={selectedUserQuery.data?.email?.split('@')?.[0]}
        onChatScreen={true}
        onlineAt={presence?.[selectedUserId]?.[0]?.onlineAt}
        userId={selectedUserQuery.data?.id}
      />

      {/* 채팅 영역 */}
      <div className="w-full overflow-y-scroll flex-1 flex flex-col p-4 gap-3">
        {getAllMessagesQuery.data?.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            isFromMe={message.receiver === selectedUserId}
          />
        ))}
      </div>

      {/* 채팅창 영역 */}
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-3 w-full border-2 border-light-blue-600"
          placeholder="메시지를 입력하세요."
        />

        <button
          onClick={() => sendMessageMutation.mutate()}
          className="min-w-20 p-3 bg-light-blue-600 text-white"
          color="light-blue"
        >
          {sendMessageMutation.isPending ? <Spinner /> : <span>전송</span>}
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
