import * as qw from './util/query-write.js';

// INIT - FOR MYSQL
async function init() {
  // 테이블 목록 정보 기록하기 : info
  // await qw.tableListData();

  // 전체 테이블 DDL 생성하기 : ddl
  // await qw.createDDLs();

  // 입력 테이블 데이터 추출 : mig
  let mig = [
    ['btch_set', '배치 시간 설정'],
    ['cmn_dtl_code', '공통 상세 코드'],
    ['cmn_grp_code', '공통 그룹 코드'],
    ['cmn_mail_stng', '공통 메일 설정'],
    ['cmn_menu', '공통 메뉴'],
    ['cmn_mnth_rltn', '공통 메뉴권한 관계'],
    ['cmn_stp', '공통 설정'],
    ['cmn_thrt', '공통 권한'],
    ['cmn_thrt_grp', '공통 권한 그룹'],
    ['cmn_thrt_rltn', '공통 권한그룹 관계'],
    ['cmn_user', '공통 사용자'],
    ['cmn_user_tmpr', '공통 사용자 임시'],
    ['prt_bsc', '운영 기본'],
    ['prt_hstr', '운영 이력'],
  ];

  await qw.extractTableData(mig.map(([table]) => table));

  // 커넥션 종료하기
  qw.close();
}
init();
