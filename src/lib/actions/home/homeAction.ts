import client from "@/lib/client/ApolloClient";
import { GET_HOME_PAGE_LATEST_ARTICLES } from "@/lib/wordpress/queries/home/homeQuery";

export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  };
}

export interface Category {
  node: {
    name: string;
    slug: string;
    languageCode: string;
  };
}

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage: FeaturedImage;
  categories: {
    edges: Category[];
  };
}

export interface HomePageDataType {
  posts: {
    nodes: Post[];
  };
}

export async function getHomePageLatestArticles(language: string = "en"): Promise<Post[]> {
  try {
    const result = await client.query<HomePageDataType>({
      query: GET_HOME_PAGE_LATEST_ARTICLES,
      variables: {
        language,
      },
      fetchPolicy: "no-cache",
      context: {
        fetchOptions: {
          next: { 
            tags: ['wordpress']
          },
        },
      },
    });

    if (result.error || !result.data?.posts?.nodes) {
      return [];
    }

    return result.data.posts.nodes;
  } catch (error) {
    console.error("Error fetching home page articles:", error);
    return [];
  }
}
