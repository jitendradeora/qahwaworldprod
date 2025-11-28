import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/actions/article/articleAction';
import { ArticleDetailPage } from '@/components/article';
import { ArticleLanguageHandler } from '@/components/article/ArticleLanguageHandler';
import { stripHtml, calculateReadTime, formatDate } from '@/lib/utils';
import { Article } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  // Decode the id to handle non-Latin characters (treating id as slug)
  const decodedId = decodeURIComponent(id);
  const articleData = await getArticleBySlug(decodedId);

  if (!articleData) {
    notFound();
  }

  // Find the primary category
  const primaryCategory = articleData.categories.nodes[0];

  // Collect all translations from all category nodes
  const allCategoryTranslations = articleData.categories.nodes
    .flatMap(cat => cat.translations || [])
    .filter((v, i, a) => v && a.findIndex(t => t.language.code === v.language.code) === i);

  const article: Article = {
    id: articleData.id,
    title: articleData.title,
    excerpt: articleData.excerpt,
    content: articleData.content,
    image: articleData.featuredImage?.node.sourceUrl || '/images/placeholder.jpg',
    category: primaryCategory?.name || 'Uncategorized',
    categorySlug: primaryCategory?.slug,
    author: articleData.author.node.name,
    date: formatDate(articleData.date, 'ar'),
    readTime: calculateReadTime(articleData.content),
    tags: articleData.tags.nodes.map(tag => tag.name),
    slug: articleData.slug,
    galleryImages: articleData.postAdvancePost?.galleryImages?.nodes || [],
    contentAfterGallery: articleData.postAdvancePost?.contentAfterGallery,
  };

  return (
    <>
      <ArticleLanguageHandler
        translations={articleData.translations || []}
        categorySlug={primaryCategory?.slug || ''}
        categoryTranslations={allCategoryTranslations}
      />
      <ArticleDetailPage article={article} locale="ar" />
    </>
  );
}
