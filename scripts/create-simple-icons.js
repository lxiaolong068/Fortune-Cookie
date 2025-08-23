const fs = require('fs');
const path = require('path');

// Base64 encoded 1x1 orange PNG (minimal PNG file)
const orangePixelPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

// Create PNG files from base64 data
function createPNGFile(filename, size) {
  // For simplicity, we'll use the same 1x1 pixel for all sizes
  // In production, you'd want proper sized icons
  const buffer = Buffer.from(orangePixelPNG, 'base64');
  const publicDir = path.join(__dirname, '..', 'public');
  const filePath = path.join(publicDir, filename);

  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Created ${filename}`);
}

// Generate all required PNG files
function generatePNGIcons() {
  const icons = [
    'favicon-16x16.png',
    'favicon-32x32.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'apple-touch-icon.png'
  ];

  console.log('Creating PNG icon files...');

  icons.forEach(icon => {
    createPNGFile(icon);
  });

  console.log('\n🎉 All PNG icon files created successfully!');
  console.log('Note: These are minimal 1x1 pixel placeholders.');
  console.log('For production, replace with proper sized icons.');
}

// Run the script
generatePNGIcons();