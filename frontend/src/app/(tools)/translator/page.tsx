import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('translator'),
  openGraph: {
    title: getToolMetaInfo('translator').title,
    description: getToolMetaInfo('translator').description,
  },
  twitter: {
    title: getToolMetaInfo('translator').title,
    description: getToolMetaInfo('translator').description,
  }
};

export default function TranslatorPage() {
  return <TextProcessor toolType="translator" />;
}
