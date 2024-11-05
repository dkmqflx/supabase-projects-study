'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadFile(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const files = Array.from(formData.entries()).map(
    ([name, file]) => file as File
  );

  // 여러가지 업로드를 한번에 진행하기 때문에 Promise.all 사용한다
  const results = await Promise.all(
    files.map(
      (file) =>
        supabase.storage
          .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
          .upload(file.name, file, { upsert: true }) // upsert 옵션 사용
    )
  );

  return results;
}

export async function searchFiles(search: string = '') {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .list(null, {
      search,
    });
  // https://supabase.com/docs/reference/javascript/storage-from-list

  handleError(error);

  return data;
}

export async function deleteFile(fileName: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .remove([fileName]); // 배열 형태로 전달받아 한번에 여러 파일을 제거할 수 있다

  handleError(error);

  return data;
}
