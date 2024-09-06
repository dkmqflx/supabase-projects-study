### Part 4. 필수 라이브러리 설정 - React Query, Supabase

- Supabase-Next.js 관련된 라이브러리나 Supabase Auth 관련된 라이브러리,

- 이런 다양한 라이브러리들이 Supabase SSR이라는 단일 라이브러리로 통합이 됐습니다

- 통합이 되면서 훨씬 더 다양한 환경을 지원을 할 수 있게 됐고요 기존에는 사용방법이 강제되었다고 하면 그런 것들도 많이 개선이 됐습니다.

<br/>

### Q. isPending vs isLoading

- tanstackquery에서 최근에 isPending이 생겨서 어느 블로그에선가 봤는데 이제 isPending을 사용하면 된다고 했던 것 같은데

- 혹시 둘의 차이가 있을까요?

- 어느 시점에서는 이것을 사용해야 한다라는 가이드가 있을까요

### A.

- 안녕하세요 🙂isPending을 공식문서에서 추천하는 이유를 예시와 함께 설명드릴게요!

  - isPending는 status 필드에서 직접 파생된 상태입니다.

  - 반면, isLoading은 status와 fetchStatus 두 가지 상태를 조합한 상태입니다.

- 그렇기 때문에 isLoading과 isError를 체크한다고 해서 "데이터가 이제 확실히 사용 가능하다"는 보장이 없습니다. 반면, isPending을 체크하면 데이터의 상태를 더 정확하게 알 수 있습니다.

- 또한, TypeScript는 pending과 error를 확인했을 때만 undefined 타입을 제거합니다.

- 예시

  - isPending: 이 상태는 데이터를 불러오는 중임을 나타냅니다. 즉, 데이터가 아직 로딩 중일 때 isPending이 true가 됩니다.

  - isLoading: 이 상태는 데이터를 불러오는 중이거나 재시도 중일 때 true가 됩니다.

- 예를 들어, 데이터를 불러올 때 isLoading이 true일 수도 있지만, 에러가 발생했을 때도 여전히 isLoading이 true일 수 있습니다. 이런 경우, 데이터를 사용할 수 있는지 확실히 알 수 없습니다.

- 하지만 isPending은 에러가 없고, 데이터가 로딩 중이기만 한 경우를 나타내므로, isPending이 false로 바뀌면 데이터가 로딩을 완료했음을 알 수 있습니다.

- 따라서, 데이터를 안전하게 사용하기 위해서는 isPending 상태를 체크하는 것이 더 정확하고 안정적이라는 이유입니다!

- https://github.com/TanStack/query/discussions/6297
