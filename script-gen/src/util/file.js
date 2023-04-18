import fs from 'fs';

/**
 * sql 폴더 아래에 있는 sql 파일을 읽어온다.
 * @param {string} id 파일명, 확장자 제외
 * @returns sql 파일 내용
 */
export function readSql(id) {
  return fs.readFileSync(`./src/sql/${id}.sql`, 'utf8');
}

export function write(path, msg) {
  fs.writeFileSync(path, msg);
}
