import { TagsPage } from '@/components/tags';

interface Props {
  params: Promise<{ tag: string }>;
}

export default async function TagRoute({ params }: Props) {
  const { tag } = await params;
  return <TagsPage tag={tag} />;
}
