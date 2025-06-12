import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('summarizer'),
  openGraph: {
    title: getToolMetaInfo('summarizer').title,
    description: getToolMetaInfo('summarizer').description,
  },
  twitter: {
    title: getToolMetaInfo('summarizer').title,
    description: getToolMetaInfo('summarizer').description,
  }
};

export default function SummarizerPage() {
  return <TextProcessor toolType="summarizer" />;
}
