import { Metadata } from 'next';
import { blogPosts } from '@/data/blogPosts';

// Dynamic metadata for blog posts
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(post => post.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Writelli',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${post.title} | Writelli Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      locale: 'en_US',
      publishedTime: post.date,
      authors: [post.author.name],
      images: [{
        url: post.image,
        alt: post.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    }
  };
}
