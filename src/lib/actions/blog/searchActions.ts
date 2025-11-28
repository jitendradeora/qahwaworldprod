import client from "@/lib/client/ApolloClient";
import { SEARCH_ARTICLES } from "@/lib/wordpress/queries/search/searchQuery";

export interface SearchArticle {
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
  categories: {
    nodes: Array<{
      name: string;
      slug: string;
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
}

export interface SearchResult {
  articles: SearchArticle[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
    hasPreviousPage: boolean;
    startCursor: string | null;
  };
}

export async function searchArticles(
  query: string,
  first: number = 10,
  after?: string,
  language?: string
): Promise<SearchResult> {
  try {
    if (!query || !query.trim()) {
      return {
        articles: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
          hasPreviousPage: false,
          startCursor: null,
        },
      };
    }

    // Normalize language to lowercase if provided
    const normalizedLanguage = language ? language.toLowerCase() : undefined;

    const result = await client.query<{
      posts: {
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
          hasPreviousPage: boolean;
          startCursor: string | null;
        };
        nodes: SearchArticle[];
      };
    }>({
      query: SEARCH_ARTICLES,
      variables: {
        search: query.trim(),
        first,
        after,
        ...(normalizedLanguage && { language: normalizedLanguage }),
      },
      fetchPolicy: "no-cache",
      context: {
        fetchOptions: {
          next: {
            tags: ["wordpress", "wordpress-search"],
          },
        },
      },
    });

    if (result.error || !result.data?.posts) {
      return {
        articles: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
          hasPreviousPage: false,
          startCursor: null,
        },
      };
    }

    return {
      articles: result.data.posts.nodes,
      pageInfo: result.data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error searching articles:", error);
    return {
      articles: [],
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
        hasPreviousPage: false,
        startCursor: null,
      },
    };
  }
}

