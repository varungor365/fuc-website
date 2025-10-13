const puppeteer = require('puppeteer');
const fs = require('fs');

async function detectTrends() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const trends = [];
  
  // Scrape Twitter trends
  try {
    await page.goto('https://twitter.com/explore/tabs/trending', { waitUntil: 'networkidle2' });
    const twitterTrends = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid="trend"]');
      return Array.from(items).slice(0, 10).map(item => item.textContent);
    });
    trends.push(...twitterTrends);
  } catch (error) {
    console.error('Twitter scraping failed:', error);
  }
  
  // Scrape Instagram hashtags
  try {
    await page.goto('https://www.instagram.com/explore/tags/streetwear/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    const instagramTrends = await page.evaluate(() => {
      const posts = document.querySelectorAll('article a');
      return Array.from(posts).slice(0, 10).map(post => post.getAttribute('href'));
    });
    trends.push(...instagramTrends);
  } catch (error) {
    console.error('Instagram scraping failed:', error);
  }
  
  await browser.close();
  
  const trendData = {
    date: new Date().toISOString(),
    trends: [...new Set(trends)],
    keywords: extractKeywords(trends)
  };
  
  fs.writeFileSync('trends-report.json', JSON.stringify(trendData, null, 2));
  console.log('✅ Trends detected and saved!');
  
  return trendData;
}

function extractKeywords(trends) {
  const keywords = new Map();
  const stopWords = ['the', 'and', 'for', 'with', 'this', 'that'];
  
  trends.forEach(trend => {
    const words = trend.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3 && !stopWords.includes(word)) {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      }
    });
  });
  
  return Array.from(keywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
}

detectTrends();
