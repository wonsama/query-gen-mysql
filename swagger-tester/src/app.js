import { writeApiAll, writeApiGet } from "./util/write.js";

import axios from "axios";
import { readJson } from "./util/file.js";

/**
 * SWAGGER API DOCS 를 읽어들인다
 * @param {string} url 주소정보
 * @returns {object} json
 */
async function readSwaggerDocsJson(url) {
  const SWAGGER_API_DOCS_URL = process.env.SWAGGER_API_DOCS_URL || "";
  if (!SWAGGER_API_DOCS_URL) {
    throw new Error("SWAGGER_API_DOCS_URL is not defined");
  }
  let json = await axios.get(SWAGGER_API_DOCS_URL);
  return json;
}

/**
 * 메인 함수
 */
async function init() {
  const IS_TEST_YN = process.env.IS_TEST_YN || "Y";

  // 테스트의 경우 mock 폴더의 api.json 파일을 읽어처리
  let json = {};
  if (IS_TEST_YN === "N") {
    // SWAGGER API DOCS 를 읽어들인다
    json = await readSwaggerDocsJson();
  } else {
    json = readJson("./mock/api.json");
  }

  // 데이터 파싱 후 output/info/api-all.csv 파일로 저장
  writeApiAll(json);
}
init();
