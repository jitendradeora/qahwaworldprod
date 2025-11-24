import { gql } from "@apollo/client";

export const GET_HOME_PAGE_LATEST_ARTICLES = gql`
  query getHomePageLatestArticles($language: String="en" ) {
    posts(first: 9, where: {language: $language}) {
        nodes {
            title
            slug
          	excerpt
            date
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
            categories{
                edges {
                    node {
                        name
                        slug
                        languageCode
                    }
                }
            }
        }
    }
}
`;