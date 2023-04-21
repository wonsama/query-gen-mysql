# README

## Pages

랜더링 방식

- SG(Server-side Generation) => 추천 / 사용자 입장에서 속도가 빠르기 때문, CDN 캐싱 가능
- SSR(Server-side Rendering)

`next build` 커맨드를 사용하여 sg 사용할 수 있다.

`npm run start` 시에는 `npm run build` 를 사전에 해야 된다

`npm run dev` 시에는 해당 uri 에 접근할 때 자동적으로 빌드 후 랜더링을 수행한다

getStaticProps()

- 페이지가 빌드될 때 실행된다.
- 해당 페이지의 props를 반환한다.

getStaticPaths()

- 정적 페이지 경로를 사전에 생성한다

## 참조링크

- [nextjs-docs](https://nextjs.org/docs)
- [nextjs-learn](https://nextjs.org/learn)
