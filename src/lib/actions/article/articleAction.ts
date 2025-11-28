import client from "@/lib/client/ApolloClient";
import { GET_ARTICLE } from "@/lib/wordpress/queries/article/articleQuery";

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
