const https = require('https');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '../fashun-store/public/models');
const BASE_URL = 'https://github.com/justadudewhohacks/face-api.js/raw/master/weights';

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function setupModels() {
  console.log('📦 Setting up face-api.js models...\n');

  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
  }

  for (const model of models) {
    const url = `${BASE_URL}/${model}`;
    const dest = path.join(MODELS_DIR, model);

    if (fs.existsSync(dest)) {
      console.log(`✅ ${model} already exists`);
      continue;
    }

    try {
      console.log(`⬇️  Downloading ${model}...`);
      await downloadFile(url, dest);
      console.log(`✅ ${model} downloaded`);
    } catch (error) {
      console.error(`❌ Failed to download ${model}:`, error.message);
    }
  }

  console.log('\n✨ Face models setup complete!');
}

setupModels().catch(console.error);
