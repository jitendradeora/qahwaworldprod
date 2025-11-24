import { ArticleDetailPage } from '@/components/article';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticleRoute({ params }: Props) {
  const { id } = await params;
  return <ArticleDetailPage articleId={id} />;
}
