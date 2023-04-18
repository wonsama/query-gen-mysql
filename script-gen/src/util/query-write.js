import * as q from './query.js';

import { write } from './file.js';

/**
 * 전체 테이블 DDL 생성하기
 */
export async function createDDLs() {
  // 전체 테이블 목록 조회
  let tables = await q.selTableList();

  // DDL 생성하기
  for (let table of tables) {
    let tableName = table.TABLE_NAME.toLowerCase();
    let ddl = await q.createDdl(tableName);
    // 파일기록
    write(`./output/ddl/${tableName}.sql`, ddl);
  }
}

/**
 * 특정 테이블 데이터 추출
 * @param {string} migTables 이관할 테이블명 목록
 */
export async function extractTableData(
  migTables,
  excludeColumns = ['rgst_id', 'rgst_date', 'edit_id', 'mdfc_date'],
) {
  let tables = await q.selTableList();
  let tbnames = tables.map((x) => x.TABLE_NAME.toLowerCase());

  // 입력 테이블명이 존재하는지 확인
  for (let tbname of migTables) {
    if (!tbnames.includes(tbname)) {
      throw new Error(`테이블이 존재하지 않습니다. ${tbname}`);
    }
  }

  let results;
  for (let tbname of migTables) {
    // 초기화
    results = [];

    // 테이블 상세 정보 확인
    let headers = await q.selTableDesc(tbname.toLowerCase());
    let colnames = headers
      .map((x) => x.COLUMN_NAME)
      .filter((x) => excludeColumns.indexOf(x) == -1);
    results.push(colnames.join(','));

    // 테이블 목록 데이터 추출
    let rows = await q.selTableDefault(tbname.toLowerCase());
    for (let row of rows) {
      let rowItem = [];
      for (let colname of colnames) {
        rowItem.push(row[colname]);
      }
      results.push(rowItem.join(','));
    }

    // 파일기록
    write(`./output/mig/${tbname}.csv`, results.join('\n'));
  }
}

export async function tableListData() {
  let list = await q.selTableList();
  let results = [];
  results.push('TABLE_NAME,TABLE_COMMENT');
  for (let item of list) {
    results.push(`${item.TABLE_NAME},${item.TABLE_COMMENT}`);
  }

  // 파일기록
  write(`./output/info/list.csv`, results.join('\n'));
}

/**
 * DB 접속을 종료한다
 */
export function close() {
  q.close();
}
