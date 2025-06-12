import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('humanizer'),
  openGraph: {
    title: getToolMetaInfo('humanizer').title,
    description: getToolMetaInfo('humanizer').description,
  },
  twitter: {
    title: getToolMetaInfo('humanizer').title,
    description: getToolMetaInfo('humanizer').description,
  }
};

export default function HumanizerPage() {
  return <TextProcessor toolType="humanizer" />;
}
