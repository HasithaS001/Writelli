import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import { AuthProviderWrapper } from '@/components/auth/AuthProviderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Writelli | AI Writing Assistant",
  description: "Unlock faster, smarter writing with our powerful AI Writing Assistant SaaS tool. Instantly generate blog posts, emails, ad copy, product descriptions, and more. Designed for creators, marketers, and businesses—get flawless, engaging, and SEO-friendly content in just a few clicks. Start writing better with AI today!",
  keywords: "grammar checker, paraphraser, Ai hummanizer, tone converter,summerizer, AI tools, writing tools",
  verification: {
    google: 'OE3cqO_EljLVzE_HWVIzgO0ynaSArSHv_wbYi6TDJUY',
  },
  authors: [{ name: 'Writelli' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'AI Writing Assistant | Writelli',
    description: 'Unlock faster, smarter writing with our powerful AI Writing Assistant SaaS tool. Instantly generate blog posts, emails, ad copy, product descriptions, and more. Designed for creators, marketers, and businesses—get flawless, engaging, and SEO-friendly content in just a few clicks. Start writing better with AI today!',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: '/ai-writer-robot.svg',
      width: 512,
      height: 512,
      alt: 'Writelli AI Writing Assistant'
    }],
    siteName: 'Writelli'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writelli | AI Writing Assistant',
    description: 'Unlock faster, smarter writing with our powerful AI Writing Assistant SaaS tool. Instantly generate blog posts, emails, ad copy, product descriptions, and more. Designed for creators, marketers, and businesses—get flawless, engaging, and SEO-friendly content in just a few clicks. Start writing better with AI today!'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
};

// Suppress hydration warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('Warning: Text content did not match') ||
        args[0]?.includes?.('Warning: Expected server HTML')) {
      return;
    }
    originalError.apply(console, args);
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="extension-modifiable" content="false" />
        <meta name="browser-extension" content="no-modify" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LN4M0YTJFC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-LN4M0YTJFC');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased`}
      >
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
