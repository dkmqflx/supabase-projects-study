## 강의소개

### Q. Nextjs14 에서의 react query사용의 필요성

- 리액트 쿼리를 사용하면 결국 client side fetching이 됩니다.

- nextjs13부터 server side fetching이 가능해지고 suspense를 활용한 data streaming은 데이터펫칭에서 새로운 패러다임을 제시했다고 생각합니다. 굳이 리액트 쿼리를 사용할 이유가 있을까요?

### A.

- 너무 좋은 질문을 주셨네요 5MIN VET님! Server action, Suspense, fetch caching정책 등 이미 훌륭한 네트워크 관리 솔루션이 탑재되어 있는 Next.js 14 버전에서 react-query를 써야하는지에 대한 주제는 이미 핫한 주제중 하나입니다. 전혀 필요없다는 사람도 있고 기존에 쓰던 기술이라 관성으로 계속 쓰는 사람들도 있어요 🙂

- 하지만 모든 기술이 그렇듯이, 흑백논리로 A 기술이 등장했다고 해서 B 기술이 쓸모없어지지는 않습니다. 제가 여전히 react query를 쓰고있는 이유는 아래와 같아요.

- fetch를 활용하지 않는 SDK 또는 레거시 코드들(axios)에 클라이언트 캐싱이 필요할 때

- client-side api call + state management가 필요할 때 react query로 두가지를 한번에 해결할 수 있음 (가독성이 좋습니다)

- 무한 스크롤 구현시 유용한 훅을 제공합니다. 이외에도 pagination 구현시 유용한 훅을 제공하거나 mutation과 연관된 캐시 키들을 활용해 optimistic update를 하는 등 고수준의 최적화가 가능해요.

- 제 개인적인 생각으로는, react query를 사용할지 말지는 이제는 취향의 영역으로 넘어온 것 같습니다. 관련해서 해외 아티클과 reddit을 정말 많이 찾아봤던 사람으로서, 아래 글이 제일 정리를 잘했다는 판단이 들어서 공유를 드려요 ㅎㅎ 또 의문이 드는 부분이 있다면 언제든지 질문주세요 😉

- https://xionwcfm.tistory.com/m/339

<br/>

##

### Q. File 처리 관련 궁금사항

- 안녕하세요, Drag & Drop 강의 도중 궁금한 점이 생겨 질문드립니다. File Upload 처리 같은 경우는, SupaBase가 아니어도, 보통은 이러한 방식으로 File 객체를 전달하는 것이 맞을까요??

- 어떤 방법이 조금 더 일반적인지 궁금합니다!

### A.

- 안녕하세요 🙂 File Upload는 보통 FormData를 통해서 File 객체를 서버로 전달합니다!

- 아래 mozilla 문서를 보시면 아바타 파일을 전달하는 예제가 있는데 한번 살펴보시겠어요?

  - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects

<br/>

### Q. getPublicUrl로 이미지 URL 받는 방법?

- getImageUrl을 얻는 방식을 강의 방식이 아닌 getPublicUrl을 사용해서 얻으려면 어떻게 해야 하나요?

### A.

- Supabase의 getPublicUrl을 Next.js 14에서 사용하는 방법을 간단히 설명해드릴게요.

1. **getPublicUrl 사용법**

- Supabase Storage에 저장된 파일의 공용 URL을 생성하려면, 아래처럼 getPublicUrl을 사용하면 됩니다.

- 이 함수는 주어진 경로에 해당하는 파일의 공용 URL을 반환합니다. 예를 들어, images/example.png 파일의 URL을 가져올 수 있습니다.

```tsx
export async function getPublicImageUrl(path) {
  const { data } = supabase.storage
    .from("your-bucket-name") // 버킷 이름
    .getPublicUrl(path); // 파일의 경로

  return data.publicUrl;
}
```

2. **Next.js에서 활용하기**

- 서버 컴포넌트에서 이미지 URL을 미리 생성하고 렌더링할 수 있습니다:

```tsx
// app/page.js
import { getPublicImageUrl } from "./supabase-client";

export default async function Page() {
  const imageUrl = await getPublicImageUrl("images/example.png");
  return (
    <div>
      <img src={imageUrl} alt="Example" />
    </div>
  );
}
```

- 클라이언트 컴포넌트에서 동적으로 URL을 가져와 렌더링할 수도 있습니다:

```tsx
import { useEffect, useState } from "react";
import { getPublicImageUrl } from "./supabase-client";

export default function ImageComponent() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchImageUrl() {
      const url = await getPublicImageUrl("images/example.png");
      setImageUrl(url);
    }

    fetchImageUrl();
  }, []);

  return <div>{imageUrl && <img src={imageUrl} alt="Example" />}</div>;
}
```

- 요약

  - getPublicUrl을 사용해 Supabase Storage에서 파일의 공용 URL을 가져올 수 있습니다.

  - 서버 또는 클라이언트 컴포넌트에서 이 URL을 활용해 이미지를 렌더링할 수 있습니다.
