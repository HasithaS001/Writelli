const fs = require('fs');
const path = require('path');

// Escape quotes in files with unescaped entities
function fixUnescapedEntities(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content
    .replace(/(\w)'(\w)/g, "$1&apos;$2") // Don't -> Don&apos;t
    .replace(/(\s)"(\w)/g, "$1&quot;$2") // " at start of word
    .replace(/(\w)"(\s)/g, "$1&quot;$2"); // " at end of word
  
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed unescaped entities in ${filePath}`);
}

// Process specific files with unescaped entity issues
const filesToFix = [
  'src/app/not-found.tsx',
  'src/app/blog/[slug]/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/forgot-password/page.tsx',
  'src/app/pricing/page.tsx',
  'src/app/signin/page.tsx',
  'src/components/landing/ReadabilityCheckerPromo.tsx',
  'src/components/landing/AuthorsReviewSection.tsx',
  'src/components/TextProcessor.fixed.tsx',
  'src/components/TextProcessor.temp.tsx',
  'src/components/TextProcessor.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    fixUnescapedEntities(filePath);
  }
});

console.log('Lint fixes applied!');