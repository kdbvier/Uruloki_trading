import { GraphQLClient, gql } from "graphql-request";
const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
  },
});
export default async function getEntriesLanding() {
  const query = gql`
    query LandingPageContent {
      landingPageCollection {
        items {
          footer {
            mainText
            afterMainText
          }
          navbar {
            icon {
              title
              url
              width
              height
            }
          }
          benifits {
            afterMainText
            mainText
            beforeMainText
            benefitItemsCollection {
              items {
                title
                description
              }
            }
          }
          hero {
            title
            beforeHeroText
            afterHeroText
            image {
              url
              width
              height
            }
          }
          keyFeatures {
            featuresCollection {
              items {
                title
                description
                icon {
                  url
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  `;
  const response = await client.request(query);

  const { howItWorks } = await getHowItworks();

  return { response, howItWorks };
}

async function getHowItworks() {
  const query = gql`
    query HowItworksContent {
      gettingStartedItemCollection {
        items {
          description
          descriptionHeader
          features
          orientation
          image {
            title
            fileName
            url
            description
            width
            height
            size
          }
        }
      }
    }
  `;

  const howItWorks = await client.request(query);

  return { howItWorks };
}
