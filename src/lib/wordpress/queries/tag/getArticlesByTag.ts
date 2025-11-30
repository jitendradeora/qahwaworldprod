import { gql } from "@apollo/client";

export const GET_ARTICLES_BY_TAG = gql`
  query GetArticlesByTag($tagSlug: String!, $language: String, $first: Int, $after: String) {
    posts(
      where: {
        tag: $tagSlug
        language: $language
      }
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
            slug
          }
        }
        translations {
          slug
        }
        seo {
        canonical
        metaDesc
        metaKeywords
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphImage {
          altText
          sourceUrl
        }
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
        readingTime
        schema {
          articleType
          pageType
          raw
        }
        title
        twitterDescription
        twitterImage {
          altText
          sourceUrl
        }
      }
      status
      }
    }
  }
`;

