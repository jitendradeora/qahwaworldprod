import { ArticleDetailPage } from '@/components/article';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  return <ArticleDetailPage articleId={id} />;
}
