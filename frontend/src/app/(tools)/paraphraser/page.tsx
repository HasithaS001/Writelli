import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('paraphraser'),
  openGraph: {
    title: getToolMetaInfo('paraphraser').title,
    description: getToolMetaInfo('paraphraser').description,
  },
  twitter: {
    title: getToolMetaInfo('paraphraser').title,
    description: getToolMetaInfo('paraphraser').description,
  }
};

export default function ParaphraserPage() {
  return <TextProcessor toolType="paraphraser" />;
}
