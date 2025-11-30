import { gql } from "@apollo/client";

export const GET_SITEMAP_PAGES = gql`
query SitemapPages($lang: String, $first: Int!, $after: String) {
    pages(where: { language: $lang, status: PUBLISH }, first: $first, after: $after) {
      nodes { slug date }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SITEMAP_POSTS = gql`
query SitemapPosts($lang: String, $first: Int!, $after: String) {
    posts(where: { language: $lang, status: PUBLISH }, first: $first, after: $after) {
      nodes { slug date categories { nodes { slug } } }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SITEMAP_CATEGORIES = gql`
query SitemapCategories($lang: String, $first: Int!, $after: String) {
    categories(where: { language: $lang }, first: $first, after: $after) {
      nodes { slug }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SITEMAP_TAGS = gql`
query SitemapTags($lang: String, $first: Int!, $after: String) {
    tags(where: { language: $lang }, first: $first, after: $after) {
      nodes { slug }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;