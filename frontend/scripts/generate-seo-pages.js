/**
 * Script to generate static HTML files for SEO
 * This helps Google properly index unique metadata for each tool
 */

const fs = require('fs');
const path = require('path');

// Tool metadata
const tools = [
  {
    slug: 'readability-checker',
    title: 'AI Readability Checker | Writelli',
    description: "Analyze and improve your content with our free readability checker. Instantly calculate your readability score using Flesch readability score, Flesch-Kincaid readability scores, and Gunning Fog readability scores. Perfect for writers, educators, and marketers who want clear, reader-friendly content.",
    keywords: 'readability checker, readability score, flesch readability score,flesch-kincaid readability scores,gunning fog readability scores',
    image: 'readability-checker-og.png'
  },
  {
    slug: 'humanizer',
    title: 'AI Text Humanizer | Writelli',
    description: 'Humanize AI content effortlessly with our advanced AI Humanizer tool. Instantly transform robotic, AI-generated text into natural, engaging, and authentic writing. Perfect for content creators, marketers, and students. Use our Humanizer AI to improve clarity, tone, and flow. The best solution for content humanization and making AI text sound real. Try our AI Text Improver and Humanize AI content now!',
    keywords: 'hummanize ai, ai hummanizer​, AI text improver, hummanizer ai, content humanization,ai text humanizer, humanize ai text, bypass ai detection, make ai text sound human, ai writing humanizer, ai content humanizer',
    image: 'humanizer-og.png'
  },
  {
    slug: 'tone-converter',
    title: 'AI Tone Converter | Writelli',
    description: 'Easily adjust your writing with our tone converter and text tone modifier. Change the writing style and content style to match any audience using advanced AI writing tone technology. The perfect writing style changer for professionals, students, and content creators.',
    keywords: 'tone converter, writing style changer, text tone modifier, AI writing tone, content style,tone converter, writing tone changer, text tone adjuster, formal tone converter, casual tone converter, professional tone editor, writing style converter',
    image: 'tone-converter-og.png'
  },
  {
    slug: 'translator',
    title: 'AI Text Translator | Writelli',
    description: 'Instantly translate text with our powerful AI translate tool. Effortlessly translate English to Spanish, Spanish to English, Chinese to English, English to Tamil, Telugu to English, and Romanian to English. A fast, accurate, and reliable multilingual tool for global communication.. Get natural and fluent translations for your content.',
    keywords: 'translate​, Ai translate, translate english to spanish​, translate spanish to english, chinese to english translator, english to tamil translation,telugu to english translation​, translate romanian to english​,multilingual tool,ai translator, language translator, text translator, document translator, free translation tool, online translator, multilingual translator',
    image: 'translator-og.png'
  }
];

// HTML template function
const generateHtml = (tool) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.title}</title>
  <meta name="description" content="${tool.description}">
  <meta name="keywords" content="${tool.keywords}">
  
  <meta property="og:title" content="${tool.title}">
  <meta property="og:description" content="${tool.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://writelli.com/${tool.slug}">
  <meta property="og:site_name" content="Writelli">
  <meta property="og:image" content="https://writelli.com/images/${tool.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Writelli ${tool.title}">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${tool.title}">
  <meta name="twitter:description" content="${tool.description}">
  <meta name="twitter:image" content="https://writelli.com/images/${tool.image}">
  
  <link rel="canonical" href="https://writelli.com/${tool.slug}">
  
  <!-- Schema.org markup for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${tool.title}",
    "description": "${tool.description}",
    "applicationCategory": "WritingApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Web",
    "url": "https://writelli.com/${tool.slug}",
    "image": "https://writelli.com/images/${tool.image}",
    "provider": {
      "@type": "Organization",
      "name": "Writelli",
      "url": "https://writelli.com"
    }
  }
  </script>
  
  <meta http-equiv="refresh" content="0;url=https://writelli.com/${tool.slug}">
</head>
<body>
  <h1>${tool.title}</h1>
  <p>${tool.description}</p>
  <p>Redirecting to <a href="https://writelli.com/${tool.slug}">Writelli ${tool.title}</a>...</p>
</body>
</html>`;

// Create directory if it doesn't exist
const seoDir = path.join(__dirname, '..', 'public', 'seo');
if (!fs.existsSync(seoDir)) {
  fs.mkdirSync(seoDir, { recursive: true });
}

// Generate files for each tool
tools.forEach(tool => {
  const filePath = path.join(seoDir, `${tool.slug}.html`);
  fs.writeFileSync(filePath, generateHtml(tool));
  console.log(`Generated SEO file for ${tool.slug}`);
});

console.log('All SEO HTML files generated successfully!');
