import { AboutPage } from '@/components/about';

interface Props {
  params: Promise<{  }>;
}

export default async function AboutRoute({ params }: Props) {
  const {} = await params;
  return <AboutPage locale="ar" />;
}
