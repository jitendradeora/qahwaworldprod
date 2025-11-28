import { gql } from "@apollo/client";

export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($categorySlug: String!, $language: String) {
    posts(
      where: {
        categoryName: $categorySlug
        language: $language
      }
    ) {
      nodes {
        id
        title
        excerpt
        content
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
            translations {
              slug
              languageCode
            }
          }
        }
        tags {
          nodes {
            name
          }
        }
        translations {
          slug
        }
      }
    }
  }
`;
