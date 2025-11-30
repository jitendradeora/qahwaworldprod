import client from "@/lib/client/ApolloClient";
import { GET_ARTICLES_BY_CATEGORY } from "@/lib/wordpress/queries/category/getArticlesByCategory";
import { Article } from "@/types/wordpress";

export interface CategoryArticlesResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Article[];
  };
}

export async function getArticlesByCategory(
  categorySlug: string,
  language: string = 'en',
  first: number = 12,
  after?: string
): Promise<{ articles: Article[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  try {
    const variables: any = {
      categorySlug,
      language,
      first,
      ...(after && { after })
    };

    const { data, error } = await client.query<CategoryArticlesResponse>({
      query: GET_ARTICLES_BY_CATEGORY,
      variables,
      fetchPolicy: "no-cache",
    });

    if (error) {
      console.error('❌ GraphQL error fetching category articles:', error);
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    return {
      articles: data?.posts?.nodes || [],
      pageInfo: data?.posts?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('❌ Error fetching articles by category:', error);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}
