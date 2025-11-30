import client from "@/lib/client/ApolloClient";
import { GET_ARTICLES_BY_AUTHOR_ID } from "@/lib/wordpress/queries/author/authorQuery";
import { Article } from "@/types/wordpress";

export interface AuthorArticlesResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Article[];
  };
}

export async function getArticlesByAuthor(
  authorId: number,
  language: string = 'en',
  first: number = 12,
  after?: string
): Promise<{ articles: Article[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  try {
    const variables: any = { 
      authorId, 
      language,
      first, 
      ...(after && { after })
    };

    console.log('🔍 Fetching articles by author:', { authorId, language, first, after, variables });

    const { data, error } = await client.query<AuthorArticlesResponse>({
      query: GET_ARTICLES_BY_AUTHOR_ID,
      variables,
      fetchPolicy: "no-cache",
    });

    if (error) {
      console.error('❌ GraphQL error fetching author articles:', error);
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    console.log('✅ Author articles fetched:', { 
      count: data?.posts?.nodes?.length || 0,
      hasNextPage: data?.posts?.pageInfo?.hasNextPage 
    });
  
    return {
      articles: data?.posts?.nodes || [],
      pageInfo: data?.posts?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('❌ Error fetching articles by author:', error);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

