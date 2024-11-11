'use server';

import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from 'utils/supabase/server';

export async function getAllUsers() {
  // createServerSupabaseClient 를 사용하면 로그인한 유저만 가져올 수 있다.
  // 즉, 어드민 API에 대해 접근이 불가능한데, 다시말해 모든 유저들에 대한 정보를 가져오기 위해서
  // createServerSupabaseAdminClient를 사용한다
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return [];
  }

  return data.users;
}

export async function getUserById(userId) {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    return null;
  }

  return data.user;
}

// 보내고 싶은 message와, 내가 채팅하고 있는 상대방의 유저 id를 받는다 => chatUserId
export async function sendMessage({ message, chatUserId }) {
  // createServerSupabaseAdminClientd으로 만들면 현재 로그인한 유저를 알 수 없기 때문
  const supabase = await createServerSupabaseClient();

  // 내 정보는 session을 통해서 받아온다
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error('User is not authenticated');
  }

  const { data, error: sendMessageError } = await supabase
    .from('message')
    .insert({
      message,
      receiver: chatUserId,
      sender: session.user.id,
    });

  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }

  return data;
}

// 나와 상대방이 나누고 있는 모든 메세지 가져올 수 있다
export async function getAllMessages({ chatUserId }) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error('User is not authenticated');
  }

  const { data, error: getMessagesError } = await supabase
    .from('message')
    .select('*')
    .or(`receiver.eq.${chatUserId},receiver.eq.${session.user.id}`) // 메세지를 받는 사람이 상대방 또는 나
    .or(`sender.eq.${chatUserId},sender.eq.${session.user.id}`) // 또는 보내는 사람이 상대방 또는 나 => 둘이 나눈 모든 대화를 가져온다
    .order('created_at', { ascending: true });

  if (getMessagesError) {
    return [];
  }

  return data;
}
