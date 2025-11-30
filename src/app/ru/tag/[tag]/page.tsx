import TagRoute from '@/app/tag/[tag]/page';

interface Props {
  params: Promise<{ tag: string }>;
}

export default async function RussianTagRoute({ params }: Props) {
  return <TagRoute params={params} locale="ru" />;
}
