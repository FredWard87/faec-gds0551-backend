import mysql from 'promise-mysql';


const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'apliweb'
});
export default pool;
