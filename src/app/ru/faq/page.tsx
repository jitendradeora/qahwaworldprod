import { FAQPage } from '@/components/faq';

interface Props {
  params: Promise<{  }>;
}

export default async function FAQRoute({ params }: Props) {
  const {} = await params;
  return <FAQPage locale="ru" />;
}
