import { notFound } from 'next/navigation';
import { getArticleBySlug, getAuthorPostCount } from '@/lib/actions/article/articleAction';
import { ArticleDetailPage } from '@/components/article';
import { ArticleLanguageHandler } from '@/components/article/ArticleLanguageHandler';
import { stripHtml, calculateReadTime, formatDate } from '@/lib/utils';
import { Article } from '@/types';
import { Metadata } from 'next';
import { getHomepageAdBanner } from '@/lib/actions/home/homeAction';
import { getArticlesByCategory } from '@/lib/actions/category/getArticlesByCategory';

interface Props {
    params: Promise<{ category: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    locale?: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const articleData = await getArticleBySlug(slug);

    if (!articleData) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${articleData.title} - Qahwa World`,
        description: stripHtml(articleData.excerpt).slice(0, 160),
        openGraph: {
            images: articleData.featuredImage ? [articleData.featuredImage.node.sourceUrl] : [],
        },
    };
}
export default async function Page({ params, searchParams, locale = 'en' }: Props) {
    const { category: categorySlug, slug } = await params;
    // Decode the slug to handle non-Latin characters
    const decodedSlug = decodeURIComponent(slug);
    // Decode the category slug to handle non-Latin characters (e.g., Arabic, Russian)
    const decodedCategorySlug = decodeURIComponent(categorySlug);
    const articleData = await getArticleBySlug(decodedSlug);

    if (!articleData) {
        notFound();
    }


    // Find the correct category node for display (current language or fallback)
    const primaryCategory = articleData.categories.nodes.find(cat => 
        cat.slug === decodedCategorySlug
    ) || articleData.categories.nodes[0];

    // Collect all translations from all category nodes
    const allCategoryTranslations = articleData.categories.nodes
        .flatMap(cat => cat.translations || [])
        .filter((v, i, a) => v && a.findIndex(t => t.language.code === v.language.code) === i);

    // Fetch author post count
    let authorPostCount: number | undefined;
    try {
        const count = await getAuthorPostCount(articleData.author.node.slug);
        if (count !== null) {
            authorPostCount = count;
        }
    } catch (error) {
        // Continue without post count if fetch fails
    }

    const article: Article = {
        id: articleData.id,
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        image: articleData.featuredImage?.node.sourceUrl || '/images/placeholder.jpg',
        category: primaryCategory?.name || 'Uncategorized',
        categorySlug: primaryCategory?.slug || decodedCategorySlug,
        author: articleData.author.node.name,
        authorId: articleData.author.node.databaseId,
        authorSlug: articleData.author.node.slug,
        authorBio: articleData.author.node.authorInfo ? {
            en: articleData.author.node.authorInfo.authorBioEn,
            ar: articleData.author.node.authorInfo.authorBioAr,
            ru: articleData.author.node.authorInfo.authorBioRu,
        } : undefined,
        authorImage: articleData.author.node.authorInfo?.authorImage?.node,
        authorPostCount: authorPostCount,
        date: formatDate(articleData.date, locale),
        readTime: calculateReadTime(articleData.content),
        tags: articleData.tags.nodes.map(tag => ({ name: tag.name, slug: tag.slug })),
        slug: articleData.slug,
        galleryImages: articleData.postAdvancePost?.galleryImages?.nodes || [],
        contentAfterGallery: articleData.postAdvancePost?.contentAfterGallery,
    };

    // Fetch related articles from the same category
    let relatedArticles: Article[] = [];
    try {
        const { articles: categoryArticles } = await getArticlesByCategory(decodedCategorySlug, locale, 10);
        // Transform WordPress articles to Article type and exclude current article
        relatedArticles = categoryArticles
            .filter(wpArticle => wpArticle.id !== articleData.id)
            .slice(0, 5)
            .map(wpArticle => {
                // Find the category that matches the current locale's category slug
                const matchingCategory = wpArticle.categories?.nodes?.find(cat => cat.slug === decodedCategorySlug) 
                    || wpArticle.categories?.nodes?.[0];
                const categoryName = matchingCategory?.name || 'Uncategorized';
                const relatedCategorySlug = matchingCategory?.slug || decodedCategorySlug;
                
                return {
                    id: wpArticle.id,
                    title: wpArticle.title,
                    excerpt: wpArticle.excerpt,
                    content: wpArticle.content || '',
                    image: wpArticle.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg',
                    category: categoryName,
                    categorySlug: relatedCategorySlug,
                    author: wpArticle.author?.node?.name || 'Unknown',
                    authorId: wpArticle.author?.node?.databaseId,
                    date: formatDate(wpArticle.date, locale),
                    readTime: calculateReadTime(wpArticle.content || ''),
                    tags: wpArticle.tags?.nodes?.map(tag => ({ name: tag.name, slug: tag.slug })) || [],
                    slug: wpArticle.slug,
                };
            });
    } catch (error) {
        // Fallback to empty array if fetch fails
        relatedArticles = [];
    }

    // Fetch ad banners
    const adBanners = await getHomepageAdBanner();
    const postAd = adBanners.find(banner => banner.name === 'post_ad');

    return (
        <>
            <ArticleLanguageHandler
                translations={articleData.translations || []}
                categorySlug={decodedCategorySlug}
                categoryTranslations={allCategoryTranslations}
            />
            <ArticleDetailPage article={article} locale={locale} postAd={postAd} relatedArticles={relatedArticles} />
        </>
    );
}
