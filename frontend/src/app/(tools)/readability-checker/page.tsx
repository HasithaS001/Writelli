import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('readability-checker'),
  openGraph: {
    title: getToolMetaInfo('readability-checker').title,
    description: getToolMetaInfo('readability-checker').description,
  },
  twitter: {
    title: getToolMetaInfo('readability-checker').title,
    description: getToolMetaInfo('readability-checker').description,
  }
};

export default function ReadabilityCheckerPage() {
  return <TextProcessor toolType="readability-checker" />;
}
