import { execQuery, getPool } from './db.js';

import dotenv from 'dotenv';
import { readSql } from './file.js';

dotenv.config();

const DB_DATABASE = process.env.DB_DATABASE;

/**
 * 테이블 목록을 조회한다
 * @returns 테이블 목록
 */
export function selTableList() {
  let query = readSql('sel_table_list');
  let params = [DB_DATABASE, 'tmp%'];
  return execQuery(query, params);
}

/**
 * 테이블 상세정보를 조회한다
 * @param {string} tableName 테이블명
 * @returns 테이블 상세정보
 */
export function selTableDesc(tableName) {
  let query = readSql('sel_table_desc');
  let params = [DB_DATABASE, tableName];
  return execQuery(query, params);
}

/**
 * 테이블 조회
 * @param {string} tableName 테이블명
 * @returns 테이블 목록정보
 */
export function selTableDefault(tableName) {
  let query = readSql('sel_default');
  let params = [tableName];
  return execQuery(query, params);
}

/**
 * DDL 구문을 생성 해준다
 * @param {string} tableName 테이블명
 * @returns DDL 구문
 */
export async function createDdl(tableName) {
  let list = await selTableList();
  let desc = await selTableDesc(tableName);

  let comments = list
    .filter((x) => x.TABLE_NAME == tableName)
    .map((x) => x.TABLE_COMMENT);

  if (comments.length == 0) {
    throw new Error(`Table ${tableName} not found`);
  }

  let tableComment = comments[0];

  let ddl = [];

  ddl.push(`CREATE TABLE \`${tableName}\` (`);

  let pk = desc
    .filter((x) => x.COLUMN_KEY == 'PRI')
    .map((x) => `\`` + x.COLUMN_NAME + `\``)
    .join(', ');
  for (let row of desc) {
    ddl.push(
      `  \`${row.COLUMN_NAME}\` ${row.COLUMN_TYPE} ${
        row.IS_NULLABLE == 'NO' ? 'NOT NULL' : ''
      } ${
        row.COLUMN_DEFAULT == '' || row.COLUMN_DEFAULT == null
          ? ''
          : `DEFAULT ${row.COLUMN_DEFAULT} `
      }COMMENT '${row.COLUMN_COMMENT}',`,
    );
  }
  ddl.push(`  PRIMARY KEY (${pk})`);
  ddl.push(
    `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='${tableComment}';`,
  );

  return ddl.join('\n');
}

/**
 * DB 접속을 종료한다
 */
export function close() {
  getPool().end();
}
