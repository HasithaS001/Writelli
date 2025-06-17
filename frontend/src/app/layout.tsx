import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProviderWrapper } from '@/components/auth/AuthProviderWrapper';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import PageTracker from '@/components/PageTracker';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased`}
      >
        <GoogleAnalytics />
        <PageTracker />
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
