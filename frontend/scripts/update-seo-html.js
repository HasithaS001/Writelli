const fs = require('fs');
const path = require('path');

// Tool metadata
const toolsMetadata = {
  'grammar-checker': {
    title: 'AI Grammar Checker | Writelli',
    description: 'Fix grammar, spelling, and punctuation instantly with our AI Grammar Checker tool. Write error-free, clear, and professional content in seconds.',
    keywords: 'grammar checker,grammar check​,grammer check​,free grammar checker​, grammar checker free​, spanish grammar check, hindi grammar check, how to do grammar check in word, best ai grammar checker​, spelling and grammar check,grammar check japanese,bangla grammar check​,japanese grammar checker,russian grammar checker​'
  },
  'paraphraser': {
    title: 'AI Paraphrasing Tool | Writelli',
    description: 'Improve your writing with our powerful AI paraphraser — the best paraphrasing tool to rewrite content quickly and accurately. Our free paraphrasing tool helps students, bloggers, and professionals rephrase text with ease.',
    keywords: 'paraphrasing tool, paraphraser​, paraphrasing, ai paraphraser, free paraphrasing tool, best ai paraphrasing tool,best paraphrasing tool​,best paraphrasing tool​'
  },
  'readability-checker': {
    title: 'AI Readability Checker | Writelli',
    description: 'Analyze and improve your content with our free readability checker. Instantly calculate your readability score using Flesch readability score, Flesch-Kincaid readability scores, and Gunning Fog readability scores.',
    keywords: 'readability checker, readability score, flesch readability score,flesch-kincaid readability scores,gunning fog readability scores'
  },
  'summarizer': {
    title: 'AI Text Summarizer | Writelli',
    description: 'Condense long articles, research papers, and documents with our AI Text Summarizer. Get concise, accurate summaries while preserving key information and context.',
    keywords: 'text summarizer, ai summarizer, article summarizer, document summarizer, content summarizer, summarizing tool, automatic summarization'
  },
  'tone-converter': {
    title: 'AI Tone Converter | Writelli',
    description: 'Transform your writing tone instantly with our AI Tone Converter. Convert between formal, casual, professional, friendly, and persuasive tones while preserving your message.',
    keywords: 'tone converter, writing tone, change tone, formal tone, casual tone, professional tone, friendly tone, persuasive tone'
  },
  'translator': {
    title: 'AI Text Translator | Writelli',
    description: 'Translate text between multiple languages accurately with our AI Text Translator. Preserve meaning, context, and nuance across languages for clear communication.',
    keywords: 'text translator, language translator, ai translator, online translator, document translator, website translator, translation tool'
  },
  'humanizer': {
    title: 'AI Text Humanizer | Writelli',
    description: 'Make AI-generated content sound human-written with our AI Text Humanizer. Add natural language patterns, varied sentence structures, and authentic voice to your content.',
    keywords: 'ai text humanizer, humanize ai text, make ai text sound human, ai detection bypass, natural sounding ai text, human writing style'
  }
};

// SEO HTML template
function generateSeoHtml(tool) {
  const metadata = toolsMetadata[tool];
  const today = new Date().toISOString().split('T')[0];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  <meta name="description" content="${metadata.description}">
  <meta name="keywords" content="${metadata.keywords}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://writelli.com/${tool}">
  <meta property="og:title" content="${metadata.title}">
  <meta property="og:description" content="${metadata.description}">
  <meta property="og:image" content="https://writelli.com/images/${tool}-og.png">
  <meta property="og:site_name" content="Writelli">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${metadata.title}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://writelli.com/${tool}">
  <meta property="twitter:title" content="${metadata.title}">
  <meta property="twitter:description" content="${metadata.description}">
  <meta property="twitter:image" content="https://writelli.com/images/${tool}-og.png">
  
  <!-- Canonical Link -->
  <link rel="canonical" href="https://writelli.com/${tool}">
  
  <!-- Robots -->
  <meta name="robots" content="index, follow">
  
  <!-- Last Modified -->
  <meta name="last-modified" content="${today}">
</head>
<body>
  <h1>${metadata.title}</h1>
  <p>${metadata.description}</p>
  
  <h2>What is Writelli ${tool.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}?</h2>
  <p>Writelli's ${metadata.title.split('|')[0].trim()} is an advanced tool that helps you improve your writing and content quality.</p>
  
  <p>Visit our <a href="https://writelli.com/${tool}">${metadata.title.split('|')[0].trim()}</a> to start using this powerful tool today!</p>
  
  <script>
    // Redirect to the actual tool page after a brief delay (for SEO crawlers)
    setTimeout(function() {
      window.location.href = "https://writelli.com/${tool}";
    }, 1500);
  </script>
</body>
</html>`;
}

// Update or create SEO HTML files
function updateSeoHtmlFiles() {
  const seoDir = path.join(__dirname, '..', 'public', 'seo');
  
  // Ensure the SEO directory exists
  if (!fs.existsSync(seoDir)) {
    fs.mkdirSync(seoDir, { recursive: true });
  }
  
  // Create or update SEO HTML files for each tool
  Object.keys(toolsMetadata).forEach(tool => {
    const filePath = path.join(seoDir, `${tool}.html`);
    const htmlContent = generateSeoHtml(tool);
    
    fs.writeFileSync(filePath, htmlContent);
    console.log(`Updated SEO HTML for ${tool}`);
  });
  
  console.log('All SEO HTML files have been updated!');
}

// Run the update
updateSeoHtmlFiles();
