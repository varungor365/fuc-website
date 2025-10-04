// Quick image verification script
const imagePaths = [
  '/stock/products/tshirt-01.png',
  '/stock/products/tshirt-02.png',
  '/stock/products/tshirt-03.png',
  '/stock/products/tshirt-04.png',
  '/stock/products/tshirt-05.png',
  '/stock/products/tshirt-06.png',
  '/stock/products/tshirt-07.png'
];

console.log('=== FASHUN.CO IMAGE VERIFICATION ===');
console.log('Checking local product images...');

imagePaths.forEach((path, index) => {
  const img = new Image();
  img.onload = () => {
    console.log(`✅ Image ${index + 1}: ${path} - LOADED`);
  };
  img.onerror = () => {
    console.log(`❌ Image ${index + 1}: ${path} - FAILED`);
  };
  img.src = path;
});

// Test external Unsplash images
const externalImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800'
];

console.log('Checking external images...');
externalImages.forEach((url, index) => {
  const img = new Image();
  img.onload = () => {
    console.log(`✅ External ${index + 1}: LOADED`);
  };
  img.onerror = () => {
    console.log(`❌ External ${index + 1}: FAILED (Network/CORS issue)`);
  };
  img.src = url;
});

export {};