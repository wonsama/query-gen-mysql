import fs from "fs";

/**
 * json 파일을 읽어온다.
 * @param {string} path 파일 경로
 * @returns json 파일 내용
 */
export function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

/**
 * 파일을 쓴다.
 * @param {string} path 파일 저장 경로
 * @param {string} msg 파일 내용
 */
export function write(path, msg) {
  fs.writeFileSync(path, msg, "utf8");
  console.log(`created file : ${path}`);
}
