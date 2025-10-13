const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '../public/sitemap-0.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');

const today = new Date().toISOString();
const fixed = sitemap.replace(/2025-10-06T17:17:58\.341Z/g, today)
  .replace(/<url><loc>https:\/\/fashun\.co\.in\/admin<\/loc>.*?<\/url>/g, '')
  .replace(/<url><loc>https:\/\/fashun\.co\.in\/login<\/loc>.*?<\/url>/g, '')
  .replace(/<url><loc>https:\/\/fashun\.co\.in\/register<\/loc>.*?<\/url>/g, '')
  .replace(/<url><loc>https:\/\/fashun\.co\.in\/wishlist<\/loc>.*?<\/url>/g, '')
  .replace(/<url><loc>https:\/\/fashun\.co\.in\/forgot-password<\/loc>.*?<\/url>/g, '');

fs.writeFileSync(sitemapPath, fixed);
console.log('✅ Sitemap fixed!');
