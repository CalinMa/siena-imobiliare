const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function setPassword() {
  const newPassword = process.argv[2];
  
  if (!newPassword) {
    console.error('Usage: node scripts/set_admin_password.js "YourNewPassword"');
    process.exit(1);
  }

  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!host || !user || !database) {
    console.error('Missing database configuration in .env');
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Generating hash...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    console.log('Saving to database...');
    await connection.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      ['admin_password_hash', hash, hash]
    );

    console.log('✅ Admin password updated successfully!');
    await connection.end();
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
}

setPassword();
