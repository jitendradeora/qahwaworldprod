import { notFound } from 'next/navigation';
import { getArticlesByAuthor } from '@/lib/actions/author/getArticlesByAuthor';
import { getAuthorPostCount } from '@/lib/actions/article/articleAction';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { AuthorContent } from '@/components/author';
import { calculateReadTime, formatDate, stripHtml } from '@/lib/utils';
import { getTranslations, getCategoryTranslation } from '@/lib/translations';
import { getLocalizedPath } from '@/lib/localization';
import Link from 'next/link';
import { ChevronRight, User } from 'lucide-react';
import { Article } from '@/types';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
  locale?: string;
}

export async function generateMetadata({ params, locale = 'en' }: Props): Promise<Metadata> {
  const { id } = await params;
  const authorId = parseInt(id, 10);
  
  if (isNaN(authorId)) {
    return {
      title: 'Author Not Found - Qahwa World',
    };
  }

  try {
    const { articles } = await getArticlesByAuthor(authorId, locale, 1);
    const authorName = articles[0]?.author?.node?.name || 'Unknown Author';
    
    return {
      title: `${authorName} - Qahwa World`,
      description: `Browse all articles by ${authorName} on Qahwa World`,
    };
  } catch (error) {
    return {
      title: 'Author - Qahwa World',
    };
  }
}

export default async function AuthorPage({ params, locale = 'en' }: Props) {
  const { id } = await params;
  const authorId = parseInt(id, 10);
  
  if (isNaN(authorId)) {
    notFound();
  }

  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);

  try {
    // Fetch initial 12 articles
    const { articles: backendArticles, pageInfo } = await getArticlesByAuthor(
      authorId,
      locale,
      12
    );

    if (!backendArticles || backendArticles.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
              {locale === 'ar'
                ? 'لا توجد مقالات لهذا المؤلف'
                : locale === 'ru'
                  ? 'Статей этого автора не найдено'
                  : 'No articles found for this author'}
            </h1>
            <Link
              href={getPath(`/`)}
              className="bg-amber-700 hover:bg-amber-800 px-4 py-2 inline-block text-white rounded-md"
            >
              {t.home}
            </Link>
          </div>
        </div>
      );
    }

    // Get author info from first article
    const authorInfo = backendArticles[0]?.author?.node;
    const authorName = authorInfo?.name || 'Unknown Author';
    const authorBio = authorInfo?.authorInfo;
    const authorImage = authorInfo?.authorInfo?.authorImage?.node;
    const authorSlug = authorInfo?.slug;

    // Fetch total post count for the author
    let totalPostCount: number | undefined;
    if (authorSlug) {
      try {
        const count = await getAuthorPostCount(authorSlug);
        if (count !== null) {
          totalPostCount = count;
        }
      } catch (error) {
        console.error('Error fetching author post count:', error);
        // Continue without post count if fetch fails
      }
    }

    // Map backend articles to frontend Article type
    const articles: Article[] = backendArticles.map((a) => {
      const matchingCategory = a.categories?.nodes?.[0];
      const categoryNameFromWP = matchingCategory?.name || '';
      
      // Find the category slug that matches the current locale
      let categorySlug = matchingCategory?.slug || '';
      if (matchingCategory?.translations && matchingCategory.translations.length > 0) {
        // Find translation that matches current locale
        const localeTranslation = matchingCategory.translations.find(
          (t) => t.languageCode?.toLowerCase() === locale.toLowerCase()
        );
        if (localeTranslation?.slug) {
          categorySlug = localeTranslation.slug;
        }
      }
      
      // Translate category name based on locale
      const categoryName = getCategoryTranslation(categoryNameFromWP, locale);

      return {
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        category: categoryName,
        categorySlug: categorySlug,
        image: a.featuredImage?.node?.sourceUrl || '',
        date: formatDate(a.date, locale),
        author: a.author?.node?.name || '',
        authorId: a.author?.node?.databaseId,
        readTime: calculateReadTime(a.content || ''),
        featured: false,
        tags: a.tags?.nodes?.map((t: { name: string; slug: string }) => ({
          name: t.name,
          slug: t.slug,
        })) || [],
        content: a.content,
        slug: a.slug,
      };
    });

    // Fetch ad banners
    const adBanners = await getHomepageAdBanner();
    const authorAd = adBanners.find(banner => banner.name === 'author_ad');

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
              <span className="text-gray-900 dark:text-gray-100">{authorName}</span>
            </div>
          </div>
        </div>

        {/* Author Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-start gap-6">
              {authorImage ? (
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 shadow-lg">
                  <img
                    src={authorImage.sourceUrl}
                    alt={authorImage.altText || authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full flex items-center justify-center text-white text-3xl shrink-0 shadow-lg">
                  <User className="w-12 h-12" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  {authorName}
                </h1>
                {authorBio && (
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mb-4">
                    {locale === 'ar' && authorBio.authorBioAr
                      ? authorBio.authorBioAr
                      : locale === 'ru' && authorBio.authorBioRu
                        ? authorBio.authorBioRu
                        : authorBio.authorBioEn || ''}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalPostCount !== undefined ? totalPostCount : articles.length}{' '}
                  {locale === 'ar'
                    ? (totalPostCount !== undefined ? totalPostCount : articles.length) === 1
                      ? 'مقال'
                      : 'مقالاً'
                    : locale === 'ru'
                      ? (totalPostCount !== undefined ? totalPostCount : articles.length) === 1
                        ? 'статья'
                        : (totalPostCount !== undefined ? totalPostCount : articles.length) >= 2 && (totalPostCount !== undefined ? totalPostCount : articles.length) <= 4
                          ? 'статьи'
                          : 'статей'
                      : (totalPostCount !== undefined ? totalPostCount : articles.length) === 1
                        ? 'article'
                        : 'articles'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Banner Ad */}
          {authorAd && (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-8 rounded-lg">
              <div className="w-full max-w-5xl mx-auto center">
                <div dangerouslySetInnerHTML={{ __html: authorAd.content }} />
              </div>
            </div>
          )}

          {/* Articles with Load More */}
          <AuthorContent
            initialArticles={articles}
            authorId={authorId}
            locale={locale}
            initialHasNextPage={pageInfo.hasNextPage}
            initialEndCursor={pageInfo.endCursor}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading author page:', error);
    notFound();
  }
}

