# README

- script-gen : mysql DB의 Table 설계 정보를 손쉽게 확인할 수 있도록 함
- swagger-tester : swagger에 정의된 정보를 가져와 작업 할 수 있도록 함

## script-gen

> mysql DB의 Table 설계 정보를 손쉽게 확인할 수 있도록 함

### script-gen 실행

```bash
# 의존성 설치
cd script-gen
npm i

# APP 설정 정보 확인
# app.js.sample 참조하여 app.js 생성

# DB 연결 정보 확인
# dot env 파일 생성 .env.sample 설정 정보 참조

# APP 실행
npm run start
```

### script-gen 결과

output 폴더에 결과물이 담겨지게 된다.

- output/dll - {talbename}.sql : 전체 테이블에 대한 DLL 정보
- output/info - table-list.csv : 전체 테이블 목록 정보 (테이블명, 테이블 설명)
- output/mig - {talbename}.csv : migration 을 수행한 결과, 지정한 테이블에 대한 전체 row 정보를 csv 형태로 출력한다.

## swagger-tester

> swagger에 정의된 정보를 가져와 작업 할 수 있도록 함

### swagger-tester 실행

```bash
# 의존성 설치
cd swagger-tester
npm i

# dot env 파일 생성 .env.sample 설정 정보 참조
# SWAGGER URL 정보 확인, IS_TEST_YN : N 설정

# APP 실행
npm run start
```

### swagger-tester 결과

output 폴더에 결과물이 담겨지게 된다.

- output/info - api-all.csv : 전체 API 목록 정보 (API명, API 설명, 필수/옵션 파라미터 ...)

## 참조 링크

- [openai-chat gpt](https://chat.openai.com/)
- [npmjs-mysql2](https://www.npmjs.com/package/mysql2)
