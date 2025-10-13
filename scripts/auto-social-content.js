const sharp = require('sharp');
const fs = require('fs');

async function generateSocialPost(product) {
  const captions = [
    `🔥 New Drop Alert! ${product.title} is now live! 💫`,
    `✨ Fresh arrival: ${product.title}. Get yours before it's gone! 🛒`,
    `🎨 Introducing ${product.title} - Your new wardrobe essential! 👕`,
    `💎 Premium quality meets street style. ${product.title} available now! 🔥`
  ];
  
  const hashtags = [
    '#streetwear', '#fashion', '#style', '#ootd', '#fashionblogger',
    '#streetstyle', '#hypebeast', '#sneakerhead', '#fashionista', '#drip'
  ];
  
  const caption = captions[Math.floor(Math.random() * captions.length)];
  const selectedHashtags = hashtags.slice(0, 5).join(' ');
  
  // Generate Instagram post image
  const postImage = await sharp(product.image)
    .resize(1080, 1080, { fit: 'cover' })
    .composite([{
      input: Buffer.from(`
        <svg width="1080" height="200">
          <rect width="1080" height="200" fill="rgba(139, 92, 246, 0.9)"/>
          <text x="540" y="100" font-family="Arial" font-size="48" fill="white" text-anchor="middle" font-weight="bold">
            ${product.title}
          </text>
          <text x="540" y="150" font-family="Arial" font-size="32" fill="white" text-anchor="middle">
            ₹${product.price}
          </text>
        </svg>
      `),
      top: 880,
      left: 0
    }])
    .toFile(`social-posts/${product.id}-instagram.jpg`);
  
  // Generate Twitter post image
  await sharp(product.image)
    .resize(1200, 675, { fit: 'cover' })
    .toFile(`social-posts/${product.id}-twitter.jpg`);
  
  const post = {
    productId: product.id,
    caption: `${caption}\n\n${selectedHashtags}`,
    images: {
      instagram: `social-posts/${product.id}-instagram.jpg`,
      twitter: `social-posts/${product.id}-twitter.jpg`
    },
    platforms: ['instagram', 'twitter', 'facebook'],
    scheduledTime: new Date(Date.now() + 3600000).toISOString()
  };
  
  fs.writeFileSync(`social-posts/${product.id}-post.json`, JSON.stringify(post, null, 2));
  console.log(`✅ Social content generated for ${product.title}`);
  
  return post;
}

module.exports = { generateSocialPost };
