require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function seed() {
  const c = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: { rejectUnauthorized: false }
  });

  await c.query(`
    INSERT INTO properties (title, slug, description, price, status, images) 
    VALUES ('Apartament de lux cu 3 camere', 'apartament-de-lux-cu-3-camere', 'Acesta este un apartament de lux complet mobilat, situat in zona centrala, aproape de toate facilitatile orasului.', 125000, 'activ', '["https://images.unsplash.com/photo-1502672260266-1c1f51197996?auto=format&fit=crop&q=80&w=800"]')
  `);
  
  await c.query(`
    INSERT INTO properties (title, slug, description, price, status, images) 
    VALUES ('Casă modernă cu grădină', 'casa-moderna-cu-gradina', 'O casă perfectă pentru o familie, situata intr-o zona linistita si plina de verdeata.', 210000, 'vandut', '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"]')
  `);
  
  console.log('Seed done');
  c.end();
}
seed();
