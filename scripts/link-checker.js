const { LinkChecker } = require('linkinator');

async function checkLinks() {
  const checker = new LinkChecker();
  
  const result = await checker.check({
    path: process.env.SITE_URL || 'http://localhost:3000',
    recurse: true,
    timeout: 5000,
    linksToSkip: [
      'https://twitter.com',
      'https://facebook.com',
      'https://instagram.com'
    ]
  });

  const brokenLinks = result.links.filter(link => link.state === 'BROKEN');
  
  if (brokenLinks.length > 0) {
    console.log('❌ Broken links found:');
    brokenLinks.forEach(link => {
      console.log(`  ${link.url} (Status: ${link.status})`);
      console.log(`    Found on: ${link.parent}`);
    });
    
    // Send notification
    await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🔗 ${brokenLinks.length} broken links found on FASHUN.CO`,
        links: brokenLinks.map(l => ({ url: l.url, parent: l.parent }))
      })
    });
  } else {
    console.log('✅ No broken links found!');
  }
}

checkLinks();
