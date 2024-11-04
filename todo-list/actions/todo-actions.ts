'use server'; // 아래 모든 함수는 서버 액션이 된다.

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

// 테이블 관련 타입 지정
export type TodoRow = Database['public']['Tables']['todo']['Row'];
export type TodoRowInsert = Database['public']['Tables']['todo']['Insert'];
export type TodoRowUpdate = Database['public']['Tables']['todo']['Update'];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getTodos({ searchInput = '' }): Promise<TodoRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .like('title', `%${searchInput}%`) // https://supabase.com/docs/reference/javascript/like
    .order('created_at', { ascending: true });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function createTodo(todo: TodoRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from('todo').insert({
    ...todo,
    created_at: new Date().toISOString(), // 잘못된 값을 클라이언트에서 만들어줄 수 있기 때문에 서버에서 이렇게 생성해주도록 한다.
  });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function updateTodo(todo: TodoRowUpdate) {
  const supabase = await createServerSupabaseClient();
  console.log(todo);

  const { data, error } = await supabase
    .from('todo')
    .update({
      ...todo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', todo.id); // 업데이트 대상을 지정해준다

  if (error) {
    handleError(error);
  }

  return data;
}

export async function deleteTodo(id: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from('todo').delete().eq('id', id);

  if (error) {
    handleError(error);
  }

  return data;
}
