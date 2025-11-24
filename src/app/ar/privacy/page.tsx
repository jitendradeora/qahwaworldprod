import { PrivacyPage } from '@/components/privacy';

interface Props {
  params: Promise<{  }>;
}

export default async function PrivacyRoute({ params }: Props) {
  const {} = await params;
  return <PrivacyPage locale="ar" />;
}
