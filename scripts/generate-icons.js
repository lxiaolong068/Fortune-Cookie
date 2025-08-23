const fs = require('fs');
const path = require('path');

// Simple function to create a basic ICO file (16x16, 32x32)
function createBasicICO() {
  // This is a minimal ICO file with a 16x16 orange square
  const icoData = Buffer.from([
    // ICO header
    0x00, 0x00, // Reserved
    0x01, 0x00, // Type (1 = ICO)
    0x01, 0x00, // Number of images
    
    // Image directory entry
    0x10, // Width (16)
    0x10, // Height (16)
    0x00, // Color count (0 = no palette)
    0x00, // Reserved
    0x01, 0x00, // Color planes
    0x20, 0x00, // Bits per pixel (32)
    0x00, 0x04, 0x00, 0x00, // Image size (1024 bytes)
    0x16, 0x00, 0x00, 0x00, // Image offset
    
    // BMP header (40 bytes)
    0x28, 0x00, 0x00, 0x00, // Header size
    0x10, 0x00, 0x00, 0x00, // Width
    0x20, 0x00, 0x00, 0x00, // Height (doubled for ICO)
    0x01, 0x00, // Planes
    0x20, 0x00, // Bits per pixel
    0x00, 0x00, 0x00, 0x00, // Compression
    0x00, 0x04, 0x00, 0x00, // Image size
    0x00, 0x00, 0x00, 0x00, // X pixels per meter
    0x00, 0x00, 0x00, 0x00, // Y pixels per meter
    0x00, 0x00, 0x00, 0x00, // Colors used
    0x00, 0x00, 0x00, 0x00, // Important colors
  ]);
  
  // Create pixel data (16x16 orange square)
  const pixelData = Buffer.alloc(16 * 16 * 4); // 4 bytes per pixel (BGRA)
  for (let i = 0; i < 16 * 16; i++) {
    const offset = i * 4;
    pixelData[offset] = 0x0b;     // Blue
    pixelData[offset + 1] = 0x9e; // Green  
    pixelData[offset + 2] = 0xf5; // Red (BGR format)
    pixelData[offset + 3] = 0xff; // Alpha
  }
  
  // AND mask (all zeros for no transparency)
  const andMask = Buffer.alloc(16 * 16 / 8);
  
  return Buffer.concat([icoData, pixelData, andMask]);
}

// Create a simple PNG file (minimal implementation)
function createSimplePNG(width, height) {
  // This creates a very basic PNG with solid color
  // For production, you'd want to use a proper PNG library
  const canvas = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f59e0b"/>
    <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/3}" fill="#fbbf24"/>
  </svg>`;
  
  return canvas;
}

// Generate all required icon files
async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  try {
    // Create favicon.ico
    const icoData = createBasicICO();
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoData);
    console.log('✓ Created favicon.ico');
    
    // Create SVG icons for different sizes
    const sizes = [
      { name: 'favicon-16x16.png', width: 16, height: 16 },
      { name: 'favicon-32x32.png', width: 32, height: 32 },
      { name: 'android-chrome-192x192.png', width: 192, height: 192 },
      { name: 'android-chrome-512x512.png', width: 512, height: 512 },
      { name: 'apple-touch-icon.png', width: 180, height: 180 }
    ];
    
    // For now, create SVG files as placeholders
    // In production, you'd convert these to actual PNG files
    sizes.forEach(size => {
      const svgContent = createSimplePNG(size.width, size.height);
      const filename = size.name.replace('.png', '.svg');
      fs.writeFileSync(path.join(publicDir, filename), svgContent);
      console.log(`✓ Created ${filename} (${size.width}x${size.height})`);
    });
    
    console.log('\n🎉 All icon files generated successfully!');
    console.log('Note: PNG files are created as SVG placeholders.');
    console.log('For production, convert SVG files to actual PNG format.');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

// Run the script
generateIcons();
