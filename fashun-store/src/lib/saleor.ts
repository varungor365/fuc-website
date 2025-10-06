import { GraphQLClient } from 'graphql-request';

export const saleorClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_SALEOR_API_URL || 'https://fashun.co.in/graphql/',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $channel: String!) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail {
            url
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProducts(limit = 20) {
  try {
    const data: any = await saleorClient.request(PRODUCTS_QUERY, {
      first: limit,
      channel: process.env.SALEOR_CHANNEL_SLUG || 'default-channel',
    });
    return data.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Saleor API Error:', error);
    return [];
  }
}
