
import { getArticlesByCategory } from '@/lib/actions/category/getArticlesByCategory';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { calculateReadTime } from '@/lib/utils';
import { getTranslations, getCategoryTranslation } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';
import Link from 'next/link';
import { CategoryContent } from '@/components/category/CategoryContent';
import { ChevronRight } from 'lucide-react';
import CategoryLanguageHandler from '@/components/category/CategoryLanguageHandler';

interface Props {
  params: Promise<{ category: string }>;
  locale?: string;
}

export default async function CategoryRoute({ params, locale = 'ru' }: Props) {
  const { category } = await params;
  // Decode the category slug to handle URL-encoded characters (e.g., Arabic, Russian)
  const decodedCategory = decodeURIComponent(category);
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);


  // Fetch initial 12 articles from backend (use decoded category for API call)
  const { articles: backendArticles, pageInfo } = await getArticlesByCategory(decodedCategory, locale, 12);
  // Map backend articles to frontend Article type
  const articles = backendArticles.map((a) => {
    // Find the category that matches the current locale's category slug
    const matchingCategory = a.categories?.nodes?.find(cat => cat.slug === decodedCategory) 
      || a.categories?.nodes?.[0];
    const categoryName = matchingCategory?.name || '';
    const categorySlug = matchingCategory?.slug || '';
    
    return {
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: categoryName,
      categorySlug: categorySlug,
      image: a.featuredImage?.node?.sourceUrl || '',
      date: a.date,
      author: a.author?.node?.name || '',
      readTime: calculateReadTime(a.content || ''),
      featured: a.articleDetails?.featured,
      tags: a.tags?.nodes?.map((t: { name: string }) => t.name) || [],
      content: a.content,
      slug: a.slug,
    };
  });
  // Collect all category translations from all category nodes
  // Find the category node that matches the current categorySlug, or use all categories
  const allCategoryTranslations = backendArticles
    .flatMap(article => article.categories?.nodes || [])
    .flatMap(cat => cat.translations || [])
    .filter((v, i, a) => v && a.findIndex(t => t.languageCode === v.languageCode && t.slug === v.slug) === i);
  
  // Try to find translations from the category node that matches the current slug
  const matchingCategory = backendArticles
    .flatMap(article => article.categories?.nodes || [])
    .find(cat => cat.slug === decodedCategory);
  
  const categoryTranslations = matchingCategory?.translations || allCategoryTranslations;
  
  // Get the category name for display (use the matching category's name, or fallback to translation)
  const categoryName = matchingCategory?.name || getCategoryTranslation(decodedCategory, locale);

  // Fetch ad banners
  const adBanners = await getHomepageAdBanner();
  const categoryAd = adBanners.find(banner => banner.name === 'category_ad');

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <CategoryLanguageHandler
        categorySlug={decodedCategory}
        categoryTranslations={categoryTranslations}
      />
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href={getPath(`/`)}
              className="hover:text-amber-700 dark:hover:text-amber-500"
            >
              {t.home}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">
              {categoryName}
            </span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        {categoryAd && (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-8 rounded-lg">
            <div className="w-full max-w-5xl mx-auto center">
              <div dangerouslySetInnerHTML={{ __html: categoryAd.content }} />
            </div>
          </div>
        )}

        {/* No Articles Message */}
        {(!articles || articles.length === 0) ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No articles found in this category
            </h3>
            <Link
              href={getPath(`/`)}
              className="bg-amber-700 hover:bg-amber-800 px-4 py-2 inline-block text-white rounded-md"
            >
              {t.home}
            </Link>
          </div>
        ) : (
          <CategoryContent
            initialArticles={articles}
            locale={locale}
            categorySlug={decodedCategory}
            initialHasNextPage={pageInfo.hasNextPage}
            initialEndCursor={pageInfo.endCursor}
          />
        )}
      </div>
    </div>
  );
}
