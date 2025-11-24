import { CategoryPage } from '@/components/category';

interface Props {
  params: Promise<{ category: string; locale: string }>;
}

export default async function CategoryRoute({ params }: Props) {
  const { category, locale } = await params;
  return <CategoryPage category={category} locale="ar" />;
}
