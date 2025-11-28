import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/actions/article/articleAction';
import { ArticleDetailPage } from '@/components/article';
import { ArticleLanguageHandler } from '@/components/article/ArticleLanguageHandler';
import { stripHtml, calculateReadTime, formatDate } from '@/lib/utils';
import { Article } from '@/types';
import { Metadata } from 'next';

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
    const articleData = await getArticleBySlug(decodedSlug);

    if (!articleData) {
        notFound();
    }


    // Find the correct category node for display (current language or fallback)
    const primaryCategory = articleData.categories.nodes.find(cat => 
        cat.slug === categorySlug
    ) || articleData.categories.nodes[0];

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
        author: articleData.author.node.name,
        date: formatDate(articleData.date, locale),
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
                categorySlug={categorySlug}
                categoryTranslations={allCategoryTranslations}
            />
            <ArticleDetailPage article={article} locale={locale} />
        </>
    );
}
