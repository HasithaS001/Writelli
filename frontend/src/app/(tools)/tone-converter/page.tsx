import { Metadata } from 'next';
import TextProcessor from '@/components/TextProcessor';
import { getToolMetaInfo } from '@/utils/metaUtils';

export const metadata: Metadata = {
  ...getToolMetaInfo('tone-converter'),
  openGraph: {
    title: getToolMetaInfo('tone-converter').title,
    description: getToolMetaInfo('tone-converter').description,
  },
  twitter: {
    title: getToolMetaInfo('tone-converter').title,
    description: getToolMetaInfo('tone-converter').description,
  }
};

export default function ToneConverterPage() {
  return <TextProcessor toolType="tone-converter" />;
}
