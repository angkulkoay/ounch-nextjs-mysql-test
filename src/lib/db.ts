import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '1234', 
  database: 'sample_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 