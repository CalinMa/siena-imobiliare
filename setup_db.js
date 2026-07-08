require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function setup() {
  const c = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await c.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\``);
    await c.query(`USE \`${process.env.MYSQL_DATABASE}\``);
    
    await c.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price DECIMAL(10, 2),
        images JSON,
        status ENUM('activ', 'vandut') DEFAULT 'activ',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Database and properties table created successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    c.end();
  }
}
setup();
