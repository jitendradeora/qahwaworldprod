import { getArticlesByTag } from '@/lib/actions/tag/getArticlesByTag';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { calculateReadTime } from '@/lib/utils';
import { getTranslations } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';
import Link from 'next/link';
import { CategoryContent } from '@/components/category/CategoryContent';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ tag: string }>;
  locale?: string;
}

export default async function TagRoute({ params, locale = 'en' }: Props) {
  const { tag } = await params;
  // Decode the tag slug to handle URL-encoded characters (e.g., Arabic, Russian)
  const decodedTag = decodeURIComponent(tag);
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);

  // Fetch initial 12 articles from backend (use decoded tag for API call)
  const { articles: backendArticles, pageInfo } = await getArticlesByTag(decodedTag, locale, 12);
  // Map backend articles to frontend Article type
  const articles = backendArticles.map((a) => {
    // Find the tag that matches the current locale's tag slug
    const matchingTag = a.tags?.nodes?.find(t => t.slug === decodedTag) 
      || a.tags?.nodes?.[0];
    const tagName = matchingTag?.name || '';
    const tagSlug = matchingTag?.slug || '';
    
    // Find the category that matches the current locale (for proper category slug in links)
    const matchingCategory = a.categories?.nodes?.[0];
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
      tags: a.tags?.nodes?.map((t: { name: string; slug: string }) => ({ name: t.name, slug: t.slug })) || [],
      content: a.content,
      slug: a.slug,
    };
  });

  // Get the tag name for display (use the matching tag from backend articles)
  const firstArticleWithTag = backendArticles.find(a => 
    a.tags?.nodes?.some(t => t.slug === decodedTag)
  );
  const matchingTagFromBackend = firstArticleWithTag?.tags?.nodes?.find(t => t.slug === decodedTag);
  const tagName = matchingTagFromBackend?.name || decodedTag;

  // Fetch ad banners
  const adBanners = await getHomepageAdBanner();
  const tagAd = adBanners.find(banner => banner.name === 'tag_ad');

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
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
            <Link
              href={getPath(`/tags`)}
              className="hover:text-amber-700 dark:hover:text-amber-500"
            >
              {t.tags}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">
              #{tagName}
            </span>
          </div>
        </div>
      </div>

      {/* Tag Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            #{tagName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {locale === 'ar'
              ? `تصفح جميع المقالات الموسومة بـ "${tagName}"`
              : locale === 'ru'
                ? `Просмотр всех статей с тегом "${tagName}"`
                : `Browse all articles tagged with "${tagName}"`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        {tagAd && (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-8 rounded-lg">
            <div className="w-full max-w-5xl mx-auto center">
              <div dangerouslySetInnerHTML={{ __html: tagAd.content }} />
            </div>
          </div>
        )}

        {/* No Articles Message */}
        {(!articles || articles.length === 0) ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {locale === 'ar'
                ? 'لا توجد مقالات بهذا الوسم'
                : locale === 'ru'
                  ? 'Статей с этим тегом не найдено'
                  : 'No articles found with this tag'}
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
            tagSlug={decodedTag}
            initialHasNextPage={pageInfo.hasNextPage}
            initialEndCursor={pageInfo.endCursor}
          />
        )}
      </div>
    </div>
  );
}
