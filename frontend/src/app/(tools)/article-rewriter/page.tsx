import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('article-rewriter'),
  openGraph: {
    title: getToolMetaInfo('article-rewriter').title,
    description: getToolMetaInfo('article-rewriter').description,
  },
  twitter: {
    title: getToolMetaInfo('article-rewriter').title,
    description: getToolMetaInfo('article-rewriter').description,
  }
};

export default function ArticleRewriterPage() {
  return <TextProcessor toolType="article-rewriter" />;
}
