import { gql } from "@apollo/client";

export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
  post(id: $id, idType: SLUG) {
    id
    databaseId
    title
    excerpt
    content
    postAdvancePost {
      galleryImages {
        nodes {
          altText
          sourceUrl
        }
      }
      contentAfterGallery
    }
    date
    slug
    link
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    categories {
      nodes {
        name
        slug
        translations {
          slug
          language {
            code
          }
        }
      }
    }
    tags {
      nodes {
        name
        slug
      }
    }
    author {
      node {
        name
        slug
        databaseId
      }
    }
    translations {
      slug
      language {
        code
      }
    }
  }
}
`;

export const GET_ARTICLES = gql`
  query GetArticles($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        slug
        link
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            slug
            databaseId
          }
        }
      }
    }
  }
`;

export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($categorySlug: String!, $first: Int = 10, $after: String) {
    posts(
      first: $first
      after: $after
      where: { categoryName: $categorySlug }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        excerpt
        content
        date
        slug
        link
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
            count
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            slug
            databaseId
          }
        }
      }
    }
  }
`;
