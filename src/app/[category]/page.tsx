import { CategoryPage } from '@/components/category';

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryRoute({ params }: Props) {
  const { category } = await params;
  return <CategoryPage category={category} locale="en" />;
}
