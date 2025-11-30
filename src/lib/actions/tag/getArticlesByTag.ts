import client from "@/lib/client/ApolloClient";
import { GET_ARTICLES_BY_TAG } from "@/lib/wordpress/queries/tag/getArticlesByTag";
import { Article } from "@/types/wordpress";

export interface TagArticlesResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Article[];
  };
}

export async function getArticlesByTag(
  tagSlug: string,
  language: string = 'en',
  first: number = 12,
  after?: string
): Promise<{ articles: Article[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  try {
    const variables: any = {
      tagSlug,
      language,
      first,
      ...(after && { after })
    };

    const { data, error } = await client.query<TagArticlesResponse>({
      query: GET_ARTICLES_BY_TAG,
      variables,
      fetchPolicy: "no-cache",
    });

    if (error) {
      console.error('❌ GraphQL error fetching tag articles:', error);
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
    console.error('❌ Error fetching articles by tag:', error);
    return {
      articles: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

