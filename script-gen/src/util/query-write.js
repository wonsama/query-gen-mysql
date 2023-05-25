import * as q from './query.js';

import { write } from './file.js';

const EXCEL_SPLITTER = process.env.EXCEL_SPLITTER || '|'; // 구분자 : , 로 하면 decimal(21,6) 같은 것이 표현 안됨에 유의

/**
 * 전체 테이블 DDL 생성하기
 */
export async function createDDLs() {
  // 전체 테이블 목록 조회
  let tables = await q.selTableList();

  // DDL 생성하기
  let ddl_list = [];
  for (let table of tables) {
    let tableName = table.TABLE_NAME.toLowerCase();
    let [list, desc] = await q.getListDesc(tableName);
    let ddl = await q.createDdl(list, desc, tableName);

    // 전체 테이블 생성 정보 누적
    ddl_list.push([list, desc]);

    // 개별 파일기록
    write(`./output/ddl/${tableName}.sql`, ddl);
  }

  // 전체 테이블 생성정보 파일 기록
  write(`./output/info/table-desc-list.csv`, createTableList(ddl_list));
}

function createTableList(ddl_list) {
  let results = [];
  results.push(
    [
      '순서',
      '테이블명',
      '테이블설명',
      'PK',
      '컬럼명',
      '컬럼설명',
      '타입',
      '널여부',
      '기본값 ',
    ].join(EXCEL_SPLITTER),
  );
  for (let [list, desc] of ddl_list) {
    let tableName = desc[0].TABLE_NAME;
    let comments = list
      .filter((x) => x.TABLE_NAME == tableName)
      .map((x) => x.TABLE_COMMENT);

    if (comments.length == 0) {
      throw new Error(`Table ${tableName} not found`);
    }

    let tableComment = comments[0];
    let pks = desc.filter((x) => x.COLUMN_KEY == 'PRI');
    let rowCount = 1;
    for (let row of desc) {
      let isPk =
        pks.filter((x) => x.COLUMN_NAME == row.COLUMN_NAME).length == 0
          ? ''
          : 'PK';
      results.push(
        [
          rowCount,
          tableName,
          tableComment,
          isPk,
          row.COLUMN_NAME,
          row.COLUMN_COMMENT,
          row.COLUMN_TYPE,
          row.IS_NULLABLE,
          row.COLUMN_DEFAULT,
        ].join(EXCEL_SPLITTER),
      );
      rowCount++;
    }
  }
  return results.join('\n');
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
    results.push(colnames.join(EXCEL_SPLITTER));

    // 테이블 목록 데이터 추출
    let rows = await q.selTableDefault(tbname.toLowerCase());
    for (let row of rows) {
      let rowItem = [];
      for (let colname of colnames) {
        rowItem.push(row[colname]);
      }
      results.push(rowItem.join(EXCEL_SPLITTER));
    }

    // 파일기록
    write(`./output/mig/${tbname}.csv`, results.join('\n'));
  }
}

/**
 * 테이블 목록 데이터 추출
 */
export async function tableListData() {
  let list = await q.selTableList();
  let results = [];
  results.push(['TABLE_NAME', 'TABLE_COMMENT'].join(EXCEL_SPLITTER));
  for (let item of list) {
    results.push([item.TABLE_NAME, item.TABLE_COMMENT].join(EXCEL_SPLITTER));
  }

  // 파일기록
  write(`./output/info/table-list.csv`, results.join('\n'));
}

/**
 * DB 접속을 종료한다
 */
export function close() {
  q.close();
}
