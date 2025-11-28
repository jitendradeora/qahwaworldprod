import client from "@/lib/client/ApolloClient";
import { GET_ARTICLES_BY_CATEGORY } from "@/lib/wordpress/queries/category/getArticlesByCategory";
import { Article } from "@/types/wordpress";

export async function getArticlesByCategory(categorySlug: string, language: string): Promise<Article[]> {
  const { data } = await client.query<{ posts: { nodes: Article[] } }>(
    {
      query: GET_ARTICLES_BY_CATEGORY,
      variables: { categorySlug, language },
      fetchPolicy: "no-cache",
    }
  );
  return data?.posts?.nodes || [];
}
