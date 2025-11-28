
import { getArticlesByCategory } from '@/lib/actions/category/getArticlesByCategory';
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


  // Fetch articles from backend (use decoded category for API call)
  const backendArticles = await getArticlesByCategory(decodedCategory, locale);
  // Map backend articles to frontend Article type
  const articles = backendArticles.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.categories?.nodes?.[0]?.slug || '',
    image: a.featuredImage?.node?.sourceUrl || '',
    date: a.date,
    author: a.author?.node?.name || '',
    readTime: calculateReadTime(a.content || ''),
    featured: a.articleDetails?.featured,
    tags: a.tags?.nodes?.map((t: { name: string }) => t.name) || [],
    content: a.content,
    slug: a.slug,
  }));
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

  const categoryDescriptions: Record<string, { en: string; ar: string; ru: string }> = {
    News: {
      en: "Stay updated with the latest news and trends in the coffee industry",
      ar: "ابق على اطلاع بأحدث الأخبار والاتجاهات في صناعة القهوة",
      ru: "Будьте в курсе последних новостей и тенденций в кофейной индустрии",
    },
    "Coffee Community": {
      en: "Stories and insights from coffee communities around the world",
      ar: "قصص ورؤى من مجتمعات القهوة حول العالم",
      ru: "Истории и идеи от кофейных сообществ по всему миру",
    },
    Studies: {
      en: "Research and scientific findings about coffee and its effects",
      ar: "الأبحاث والنتائج العلمية حول القهوة وتأثيراتها",
      ru: "Исследования и научные открытия о кофе и его эффектах",
    },
    Interview: {
      en: "Exclusive interviews with coffee experts and industry leaders",
      ar: "مقابلات حصرية مع خبراء القهوة وقادة الصناعة",
      ru: "Эксклюзивные интервью с экспертами по кофе и лидерами отрасли",
    },
    "Coffee Reflections": {
      en: "Personal stories and reflections on coffee culture",
      ar: "قصص شخصية وتأملات حول ثقافة القهوة",
      ru: "Личные истории и размышления о кофейной культуре",
    },
  };

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
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {categoryDescriptions[decodedCategory]?.[locale as 'en' | 'ar' | 'ru'] || ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 border dark:border-gray-600 p-6 mb-8 rounded-lg">
          <div className="flex items-center justify-center h-32 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="block mb-2 text-2xl">📢</span>
              <span className="block">Banner Advertisement</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">970x90</span>
            </div>
          </div>
        </div>

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
          <CategoryContent articles={articles} locale={locale} />
        )}
      </div>
    </div>
  );
}
