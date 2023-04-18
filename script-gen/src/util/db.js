import * as mysql from 'mysql2';

import dotenv from 'dotenv';

dotenv.config();

const _pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * 현재 풀을 반환
 * @returns {Pool} 풀
 */
export function getPool() {
  return _pool;
}

/**
 * 쿼리 실행
 * @param {string} query 쿼리
 * @param {Array} params 파라미터
 * @returns {Promise} 수행결과
 */
export function execQuery(query, params = []) {
  let sql = mysql.format(query, params);
  console.log(sql);

  return new Promise((resolve, reject) => {
    _pool.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
