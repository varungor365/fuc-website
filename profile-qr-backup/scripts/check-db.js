const Database = require('better-sqlite3');
const { join } = require('path');

const dbPath = join(__dirname, '..', 'data', 'profiles.db');
console.log('Database path:', dbPath);

try {
  const db = new Database(dbPath);
  
  console.log('✅ Database connection successful');
  
  // Check if tables exist
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name));
  
  // Check users
  const users = db.prepare('SELECT id, username, display_name FROM users').all();
  console.log('Users:', users);
  
  // Check links for user ID 1
  const links = db.prepare('SELECT * FROM links WHERE user_id = 1').all();
  console.log('Links for user 1:', links);
  
  db.close();
} catch (error) {
  console.error('❌ Database error:', error);
}