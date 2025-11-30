import client from "@/lib/client/ApolloClient";
import { GET_ARTICLE, GET_AUTHOR_POST_COUNT } from "@/lib/wordpress/queries/article/articleQuery";

export interface ArticleTranslation {
    slug: string;
    language: {
        code: string;
    };
}

export interface ArticleData {
    id: string;
    databaseId: number;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    slug: string;
    link: string;
    featuredImage: {
        node: {
            sourceUrl: string;
            altText: string;
            mediaDetails?: {
                width: number;
                height: number;
            };
        };
    } | null;
    postAdvancePost?: {
        galleryImages?: {
            nodes: Array<{
                altText: string;
                sourceUrl: string;
            }>;
        };
        contentAfterGallery?: string;
    };
    categories: {
        nodes: Array<{
            name: string;
            slug: string;
            translations?: Array<{
                slug: string;
                language: {
                    code: string;
                };
            }>;
        }>;
    };
    tags: {
        nodes: Array<{
            name: string;
            slug: string;
        }>;
    };
    author: {
        node: {
            name: string;
            slug: string;
            databaseId: number;
            authorInfo?: {
                authorBioEn?: string;
                authorBioAr?: string;
                authorBioRu?: string;
                authorImage?: {
                    node: {
                        altText: string;
                        sourceUrl: string;
                    };
                };
            };
        };
    };
    translations?: ArticleTranslation[];
}

export async function getArticleBySlug(slug: string): Promise<ArticleData | null> {
    try {
        const result = await client.query<{ post: ArticleData }>({
            query: GET_ARTICLE,
            variables: { id: slug },
            fetchPolicy: 'no-cache',
        });


        if (!result.data?.post) {
            console.log('❌ No post found for slug:', slug);
            return null;
        }
        return result.data.post;
    } catch (error) {
        console.error('❌ Error fetching article by slug:', slug);
        console.error('Error details:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return null;
    }
}

export interface AuthorPostCountData {
    getAuthorPostCountBySlug: {
        count: number;
    };
}

export async function getAuthorPostCount(authorSlug: string): Promise<number | null> {
    try {
        const result = await client.query<AuthorPostCountData>({
            query: GET_AUTHOR_POST_COUNT,
            variables: { slug: authorSlug },
            fetchPolicy: 'no-cache',
        });

        if (!result.data?.getAuthorPostCountBySlug) {
            console.log('❌ No post count found for author slug:', authorSlug);
            return null;
        }
        return result.data.getAuthorPostCountBySlug.count;
    } catch (error) {
        console.error('❌ Error fetching author post count:', authorSlug);
        console.error('Error details:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
        }
        return null;
    }
}
