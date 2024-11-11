'use client';

import { useQuery } from '@tanstack/react-query';
import Person from './Person';
import { useRecoilState } from 'recoil';
import {
  presenceState,
  selectedUserIdState,
  selectedUserIndexState,
} from 'utils/recoil/atoms';
import { getAllUsers } from 'actions/chatActions';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useEffect } from 'react';

export default function ChatPeopleList({ loggedInUser }) {
  const [selectedUserId, setSelectedUserId] =
    useRecoilState(selectedUserIdState);
  const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(
    selectedUserIndexState
  );
  const [presence, setPresence] = useRecoilState(presenceState);

  // getAllUsers
  const getAllUsersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      console.log(allUsers);
      return allUsers.filter((user) => user.id !== loggedInUser.id);
    },
  });

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    // channel 제목은 아무거나 지어도 된다
    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: loggedInUser.id,
          // 여기서 key는 실제로 로그인한 유저가 언제 로그인이 였는지 트래킹 하기 위함
        },
      },
    });

    // channel의 presence를 구독한다
    channel.on('presence', { event: 'sync' }, () => {
      // sync 사용하면 사실상 join이나 leave를 구독할 필요가 없다

      const newState = channel.presenceState();
      const newStateObj = JSON.parse(JSON.stringify(newState)); // newState를 바꾸지 않도록 새로운 객체를 만들어준다
      setPresence(newStateObj);
    });

    channel.subscribe(async (status) => {
      // 구독이 완료되지 않았다면 return
      if (status !== 'SUBSCRIBED') {
        return;
      }

      const newPresenceStatus = await channel.track({
        onlineAt: new Date().toISOString(), // 현재시간
      });
      console.log(newPresenceStatus); // ok 뜨면 잘 된것
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="h-screen min-w-60 flex flex-col bg-gray-50">
      {getAllUsersQuery.data?.map((user, index) => (
        <Person
          key={user.id}
          onClick={() => {
            setSelectedUserId(user.id);
            setSelectedUserIndex(index);
          }}
          index={index}
          isActive={selectedUserId === user.id}
          name={user.email.split('@')[0]}
          onChatScreen={false}
          onlineAt={presence?.[user.id]?.[0]?.onlineAt}
          userId={user.id}
        />
      ))}
      {/* <Person
        onClick={() => setSelectedIndex(0)}
        index={0}
        isActive={selectedIndex === 0}
        name={"Lopun"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"iasdonfiodasn"}
      />
      <Person
        onClick={() => setSelectedIndex(1)}
        index={1}
        isActive={selectedIndex === 1}
        name={"홍길동"}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={"iasdonfiodasn"}
      /> */}
    </div>
  );
}
