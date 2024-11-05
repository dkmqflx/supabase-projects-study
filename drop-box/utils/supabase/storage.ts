export function getImageUrl(path) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/${path}`;
  // Storage에서 이미지 업로드한 다음 Get URL 하면 위와 같은 형태로 url 받아오는 것을 확인할 수 있다
}
// 이미지 url을 만들어주는 유틸
