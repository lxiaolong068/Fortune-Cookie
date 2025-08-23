const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix @radix-ui imports (remove version numbers)
    const radixMatches = content.match(/@radix-ui\/([^@"']+)@[\d.]+/g);
    if (radixMatches) {
      content = content.replace(/@radix-ui\/([^@"']+)@[\d.]+/g, '@radix-ui/$1');
      modified = true;
    }

    // Fix lucide-react imports (remove version numbers)
    const lucideMatches = content.match(/lucide-react@[\d.]+/g);
    if (lucideMatches) {
      content = content.replace(/lucide-react@[\d.]+/g, 'lucide-react');
      modified = true;
    }

    // Fix other common packages with version numbers
    const packagePatterns = [
      { pattern: /class-variance-authority@[\d.]+/g, replacement: 'class-variance-authority' },
      { pattern: /cmdk@[\d.]+/g, replacement: 'cmdk' },
      { pattern: /vaul@[\d.]+/g, replacement: 'vaul' },
      { pattern: /react-hook-form@[\d.]+/g, replacement: 'react-hook-form' },
      { pattern: /input-otp@[\d.]+/g, replacement: 'input-otp' },
      { pattern: /next-themes@[\d.]+/g, replacement: 'next-themes' },
      { pattern: /sonner@[\d.]+/g, replacement: 'sonner' },
      { pattern: /react-resizable-panels@[\d.]+/g, replacement: 'react-resizable-panels' },
      { pattern: /react-day-picker@[\d.]+/g, replacement: 'react-day-picker' },
      { pattern: /embla-carousel-react@[\d.]+/g, replacement: 'embla-carousel-react' },
      { pattern: /recharts@[\d.]+/g, replacement: 'recharts' }
    ];

    packagePatterns.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix files
function fixImportsInDirectory(dirPath) {
  let totalFixed = 0;
  
  function processDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and .next directories
        if (item !== 'node_modules' && item !== '.next' && item !== '.git') {
          processDirectory(itemPath);
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        if (fixImportsInFile(itemPath)) {
          totalFixed++;
        }
      }
    });
  }
  
  processDirectory(dirPath);
  return totalFixed;
}

// Main execution
console.log('🔧 Fixing UI component imports...');
const projectRoot = path.join(__dirname, '..');
const fixedCount = fixImportsInDirectory(projectRoot);

console.log(`\n🎉 Fixed imports in ${fixedCount} files!`);
console.log('Run "npm run type-check" to verify the fixes.');
