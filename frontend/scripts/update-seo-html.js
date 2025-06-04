const fs = require('fs');
const path = require('path');

// Tool metadata with expanded content for SEO pages
const toolsMetadata = {
  'grammar-checker': {
    title: 'AI Grammar Checker | Writelli',
    description: 'Fix grammar, spelling, and punctuation instantly with our AI Grammar Checker tool. Write error-free, clear, and professional content in seconds.',
    keywords: 'grammar checker,grammar check​,grammer check​,free grammar checker​, grammar checker free​, spanish grammar check, hindi grammar check, how to do grammar check in word, best ai grammar checker​, spelling and grammar check,grammar check japanese,bangla grammar check​,japanese grammar checker,russian grammar checker​',
    features: [
      'Real-time grammar error detection',
      'Spelling correction with contextual awareness',
      'Punctuation improvement suggestions',
      'Style and clarity enhancements',
      'Support for multiple languages and dialects'
    ],
    benefits: [
      'Produce error-free professional content',
      'Improve writing clarity and readability',
      'Save time on manual proofreading',
      'Enhance communication effectiveness',
      'Build credibility with polished writing'
    ],
    howToUse: [
      'Enter your text in the editor',
      'Click the "Check Grammar" button',
      'Review highlighted errors and suggestions',
      'Apply corrections with one click',
      'Download or copy your corrected text'
    ]
  },
  'paraphraser': {
    title: 'AI Paraphrasing Tool | Writelli',
    description: 'Improve your writing with our powerful AI paraphraser — the best paraphrasing tool to rewrite content quickly and accurately. Our free paraphrasing tool helps students, bloggers, and professionals rephrase text with ease.',
    keywords: 'paraphrasing tool, paraphraser​, paraphrasing, ai paraphraser, free paraphrasing tool, best ai paraphrasing tool,best paraphrasing tool​,best paraphrasing tool​',
    features: [
      'Multiple paraphrasing modes (Standard, Fluent, Creative)',
      'Maintains original meaning while changing structure',
      'Vocabulary enhancement and synonym suggestions',
      'Plagiarism-free content generation',
      'Support for academic, business, and creative writing'
    ],
    benefits: [
      'Avoid plagiarism in academic and professional work',
      'Create unique variations of existing content',
      'Improve readability and engagement',
      'Save time on manual rewriting',
      'Generate multiple versions of important content'
    ],
    howToUse: [
      'Paste your text into the editor',
      'Select your preferred paraphrasing mode',
      'Click "Paraphrase" to transform your text',
      'Review and edit the results as needed',
      'Copy or download your paraphrased content'
    ]
  },
  'readability-checker': {
    title: 'AI Readability Checker | Writelli',
    description: 'Analyze and improve your content with our free readability checker. Instantly calculate your readability score using Flesch readability score, Flesch-Kincaid readability scores, and Gunning Fog readability scores.',
    keywords: 'readability checker, readability score, flesch readability score,flesch-kincaid readability scores,gunning fog readability scores',
    features: [
      'Multiple readability metrics (Flesch, Flesch-Kincaid, Gunning Fog)',
      'Sentence complexity analysis',
      'Word choice and vocabulary assessment',
      'Reading level determination',
      'Specific improvement suggestions'
    ],
    benefits: [
      'Create content appropriate for your target audience',
      'Improve user engagement and comprehension',
      'Optimize content for different reading levels',
      'Enhance communication effectiveness',
      'Identify and fix overly complex passages'
    ],
    howToUse: [
      'Enter your text in the readability checker',
      'Click "Analyze Readability"',
      'Review your overall readability scores',
      'Examine detailed metrics and suggestions',
      'Make recommended changes to improve scores'
    ]
  },
  'summarizer': {
    title: 'AI Text Summarizer | Writelli',
    description: 'Condense long articles, research papers, and documents with our AI Text Summarizer. Get concise, accurate summaries while preserving key information and context.',
    keywords: 'text summarizer, ai summarizer, article summarizer, document summarizer, content summarizer, summarizing tool, automatic summarization',
    features: [
      'Multiple summarization modes (concise, detailed, bullet points)',
      'Preserves key information and main ideas',
      'Maintains context and logical flow',
      'Adjustable summary length',
      'Works with various content types (articles, research, reports)'
    ],
    benefits: [
      'Save time reading lengthy documents',
      'Extract essential information quickly',
      'Improve comprehension of complex material',
      'Create executive summaries for business documents',
      'Prepare study notes from academic papers'
    ],
    howToUse: [
      'Enter or paste your long text',
      'Select your desired summary length',
      'Choose a summarization style',
      'Click "Summarize" to generate results',
      'Review and save your summary'
    ]
  },
  'tone-converter': {
    title: 'AI Tone Converter | Writelli',
    description: 'Transform your writing tone instantly with our AI Tone Converter. Convert between formal, casual, professional, friendly, and persuasive tones while preserving your message.',
    keywords: 'tone converter, writing tone, change tone, formal tone, casual tone, professional tone, friendly tone, persuasive tone',
    features: [
      'Multiple tone options (formal, casual, professional, friendly, persuasive)',
      'Preserves original meaning and key points',
      'Adjusts vocabulary and sentence structure',
      'Maintains content integrity',
      'Provides alternative phrasing suggestions'
    ],
    benefits: [
      'Adapt content for different audiences',
      'Ensure appropriate tone for various contexts',
      'Improve communication effectiveness',
      'Save time rewriting content manually',
      'Create consistent brand voice across materials'
    ],
    howToUse: [
      'Enter your text in the editor',
      'Select your desired tone',
      'Click "Convert Tone" to transform your text',
      'Review and fine-tune the results',
      'Copy or download your tone-converted content'
    ]
  },
  'translator': {
    title: 'AI Text Translator | Writelli',
    description: 'Translate text between multiple languages accurately with our AI Text Translator. Preserve meaning, context, and nuance across languages for clear communication.',
    keywords: 'text translator, language translator, ai translator, online translator, document translator, website translator, translation tool',
    features: [
      'Support for over 100 languages',
      'Context-aware translation',
      'Preserves tone and style',
      'Handles idioms and cultural references',
      'Technical and specialized vocabulary support'
    ],
    benefits: [
      'Communicate effectively across language barriers',
      'Expand your content to global audiences',
      'Understand foreign language materials',
      'Create multilingual documentation',
      'Translate with higher accuracy than basic tools'
    ],
    howToUse: [
      'Enter text in the source language',
      'Select your target language',
      'Click "Translate" to convert your text',
      'Review and edit the translation if needed',
      'Copy or download your translated content'
    ]
  },
  'humanizer': {
    title: 'AI Text Humanizer | Writelli',
    description: 'Make AI-generated content sound human-written with our AI Text Humanizer. Add natural language patterns, varied sentence structures, and authentic voice to your content.',
    keywords: 'ai text humanizer, humanize ai text, make ai text sound human, ai detection bypass, natural sounding ai text, human writing style',
    features: [
      'Natural language pattern integration',
      'Sentence structure variation',
      'Vocabulary enhancement',
      'Tone and style customization',
      'Readability improvement'
    ],
    benefits: [
      'Create more engaging content',
      'Improve reader connection and trust',
      'Enhance content authenticity',
      'Reduce robotic-sounding text',
      'Maintain consistent brand voice'
    ],
    howToUse: [
      'Paste your AI-generated text',
      'Select your preferred writing style',
      'Choose humanization level',
      'Click "Humanize" to transform your text',
      'Review and save your humanized content'
    ]
  }
};

// SEO HTML template
function generateSeoHtml(tool) {
  const metadata = toolsMetadata[tool];
  const today = new Date().toISOString().split('T')[0];
  const toolName = tool.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
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
  
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.8rem;
      margin-top: 2rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    h3 {
      font-size: 1.3rem;
      margin-top: 1.5rem;
    }
    p {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    ul, ol {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    .feature-list, .benefit-list, .usage-list {
      list-style-type: none;
      padding-left: 0;
    }
    .feature-list li, .benefit-list li, .usage-list li {
      padding: 10px 15px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-left: 4px solid #4a90e2;
      border-radius: 3px;
    }
    .benefit-list li {
      border-left-color: #5cb85c;
    }
    .usage-list li {
      border-left-color: #f0ad4e;
    }
    .cta-button {
      display: inline-block;
      background-color: #4a90e2;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 20px;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #3a7bc8;
    }
    .tool-image {
      max-width: 100%;
      height: auto;
      margin: 20px 0;
      border-radius: 5px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 0.9rem;
      color: #777;
    }
  </style>
</head>
<body>
  <header>
    <h1>${metadata.title}</h1>
    <p class="description">${metadata.description}</p>
  </header>
  
  <main>
    <section>
      <h2>What is Writelli ${toolName}?</h2>
      <p>Writelli's ${metadata.title.split('|')[0].trim()} is an advanced AI-powered tool designed to help you improve your writing and content quality. Whether you're a student, professional writer, content creator, or business owner, our ${toolName} tool provides intelligent assistance to enhance your text.</p>
      
      <img src="https://writelli.com/images/${tool}-example.png" alt="${toolName} Example" class="tool-image">
    </section>
    
    <section>
      <h2>Key Features</h2>
      <ul class="feature-list">
        ${metadata.features.map(feature => `<li>${feature}</li>`).join('\n        ')}
      </ul>
    </section>
    
    <section>
      <h2>Benefits</h2>
      <ul class="benefit-list">
        ${metadata.benefits.map(benefit => `<li>${benefit}</li>`).join('\n        ')}
      </ul>
    </section>
    
    <section>
      <h2>How to Use</h2>
      <ol class="usage-list">
        ${metadata.howToUse.map(step => `<li>${step}</li>`).join('\n        ')}
      </ol>
    </section>
    
    <section>
      <h2>Why Choose Writelli?</h2>
      <p>Writelli offers a comprehensive suite of AI writing tools designed to help you create better content faster. Our ${toolName} tool uses advanced artificial intelligence to provide accurate, helpful suggestions that improve your writing while saving you time.</p>
      <p>Unlike other tools, Writelli's ${toolName} is:</p>
      <ul>
        <li><strong>Fast and efficient</strong> - Get results in seconds</li>
        <li><strong>User-friendly</strong> - Simple, intuitive interface</li>
        <li><strong>Accurate</strong> - Powered by state-of-the-art AI</li>
        <li><strong>Comprehensive</strong> - Part of a complete writing toolkit</li>
      </ul>
    </section>
    
    <section>
      <h2>Start Using Writelli ${toolName} Today</h2>
      <p>Ready to improve your writing with our powerful ${toolName} tool? Click the button below to get started for free:</p>
      <a href="https://writelli.com/${tool}" class="cta-button">Try ${toolName} Now</a>
    </section>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} Writelli. All rights reserved.</p>
    <p>For more information, visit our <a href="https://writelli.com/about">About page</a> or <a href="https://writelli.com/contact">contact us</a>.</p>
  </footer>
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
