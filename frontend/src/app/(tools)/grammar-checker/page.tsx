import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('grammar-checker'),
  openGraph: {
    title: getToolMetaInfo('grammar-checker').title,
    description: getToolMetaInfo('grammar-checker').description,
  },
  twitter: {
    title: getToolMetaInfo('grammar-checker').title,
    description: getToolMetaInfo('grammar-checker').description,
  }
};

export default function GrammarCheckerPage() {
  return <TextProcessor toolType="grammar-checker" />;
}
