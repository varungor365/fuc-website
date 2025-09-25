import db from '../src/lib/database.js';
import { hashPassword } from '../src/lib/auth.js';

async function seedData() {
  try {
    // Create a test user similar to the Linktr.ee profile
    const passwordHash = await hashPassword('test123');
    
    const result = db.prepare(`
      INSERT OR REPLACE INTO users (id, username, email, password_hash, display_name, bio, theme)
      VALUES (1, 'varungor365', 'varun@example.com', ?, 'VARUN KR. RUHELLA', 'Link to all my socials are down. Welcome, here are the social links', 'default')
    `).run(passwordHash);

    const userId = 1;

    // Delete existing links for this user
    db.prepare('DELETE FROM links WHERE user_id = ?').run(userId);

    // Add links similar to the Linktr.ee profile
    const links = [
      { title: 'THE CLOTHING BRAND', url: 'https://instagram.com/fashun.co.in', icon: '👕', order: 1 },
      { title: 'INSTAGRAM', url: 'https://www.instagram.com/the.varun_ruhella/', icon: '📷', order: 2 },
      { title: 'Snapchat', url: 'https://t.snapchat.com/varunn.ai', icon: '👻', order: 3 },
      { title: 'LINKEDIN', url: 'https://www.linkedin.com/in/vkruhella-j', icon: '💼', order: 4 },
      { title: 'Telegram', url: 'http://t.me/hackingmasterr', icon: '✈️', order: 5 },
      { title: 'Whatsapp', url: 'http://wa.me/+918979775590', icon: '💬', order: 6 },
      { title: 'www.threads.net', url: 'https://www.threads.net/@the.varun_ruhella', icon: '🧵', order: 7 },
      { title: 'Facebook', url: 'https://www.facebook.com/Varungor365', icon: '📘', order: 8 },
      { title: 'CLUBHOUSE', url: 'https://www.clubhouse.com/@varun.ai', icon: '🎙️', order: 9 },
      { title: 'SECOND WEBSITE', url: 'https://about.me/varungor365', icon: '🌐', order: 10 },
      { title: 'TWITTER', url: 'https://twitter.com/ruhella_varun', icon: '🐦', order: 11 },
    ];

    for (const link of links) {
      db.prepare(`
        INSERT INTO links (user_id, title, url, icon, order_index, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `).run(userId, link.title, link.url, link.icon, link.order);
    }

    console.log('✅ Seed data created successfully!');
    console.log('Test user: varungor365 / test123');
    console.log('Profile URL: http://localhost:3002/profile/varungor365');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedData();