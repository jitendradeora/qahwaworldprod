import client from "@/lib/client/ApolloClient";
import { GET_HOME_PAGE_LATEST_ARTICLES, GET_TRENDING_POSTS_FROM_HOME_PAGE } from "@/lib/wordpress/queries/home/homeQuery";

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

export interface TrendingPostCategory {
  name: string;
  slug: string;
}

export interface TrendingPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  readingTime: number;
  categories: TrendingPostCategory[];
}

export interface TrendingPostsDataType {
  trendingPosts: TrendingPost[];
}

export async function getTrendingPostsFromHomePage(lang: string): Promise<TrendingPost[]> {
  try {
    const result = await client.query<TrendingPostsDataType>({
      query: GET_TRENDING_POSTS_FROM_HOME_PAGE,
      variables: {
        lang,
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

    if (result.error || !result.data?.trendingPosts) {
      return [];
    }

    return result.data.trendingPosts;
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    return [];
  }
}
