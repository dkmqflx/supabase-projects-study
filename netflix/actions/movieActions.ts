"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function searchMovies({ search, page, pageSize }) {
  const supabase = await createServerSupabaseClient();

  const { data, count, error } = await supabase
    .from("movie")
    .select("*", { count: "exact" })
    .like("title", `%${search}%`) // search 없으면 전체 영화가 검색된다.
    .range((page - 1) * pageSize, page * pageSize - 1);
  //range - 첫번째 인자: 시작하는 곳, 두번째 인자: 끝나는 곳
  // 예를들어 현재 page 2고, pageSize가 2라면
  // (page - 1) * pageSize = 12 부터
  // page * pageSize - 1 = 23 까지 데이터를 가져온다

  // 다음 페이지가 있는지 없는지 확인해줘야 한다.
  // count가 23인데 현재 2페이지라서 page * pageSize가 24이면 다음 페이지가 없다는 것
  const hasNextPage = count > page * pageSize;

  if (error) {
    console.error(error);

    // 다음 페이지가 없다는 것을 알려주기 위해 page와 pageSize를 null로 주어야 한다
    return {
      data: [],
      count: 0,
      page: null,
      pageSize: null,
      error,
    };
  }

  return {
    data,
    page,
    pageSize,
    hasNextPage,
  };
}

export async function getMovie(id) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("id", id)
    .maybeSingle(); // 이터가 하나도 없을 때에도 정상적으로 처리되며, 빈 결과를 반환

  handleError(error);

  return data;
}
