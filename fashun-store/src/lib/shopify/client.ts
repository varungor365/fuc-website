/**
 * Shopify Storefront API Client
 * Headless commerce integration for fashun.co.in
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable');
}

if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2024-10',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

// GraphQL Queries
export const SHOPIFY_QUERIES = {
  GET_ALL_PRODUCTS: `#graphql
    query GetAllProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            handle
            title
            description
            vendor
            productType
            tags
            createdAt
            updatedAt
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  sku
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
            seo {
              title
              description
            }
          }
        }
      }
    }
  `,

  GET_PRODUCT_BY_HANDLE: `#graphql
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        vendor
        productType
        tags
        createdAt
        updatedAt
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 20) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
            }
          }
        }
        options {
          id
          name
          values
        }
        seo {
          title
          description
        }
      }
    }
  `,

  GET_COLLECTION_PRODUCTS: `#graphql
    query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              handle
              title
              vendor
              productType
              tags
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    availableForSale
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  CREATE_CART: `#graphql
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  ADD_TO_CART: `#graphql
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  UPDATE_CART_LINES: `#graphql
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `,

  REMOVE_FROM_CART: `#graphql
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `,

  GET_CART: `#graphql
    query GetCart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sku
                  availableForSale
                  quantityAvailable
                  product {
                    id
                    handle
                    title
                    featuredImage {
                      url
                      altText
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  SEARCH_PRODUCTS: `#graphql
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            handle
            title
            vendor
            productType
            tags
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `,
};

// Helper functions
export async function getAllProducts(limit = 50) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.GET_ALL_PRODUCTS, {
    variables: { first: limit },
  });
  return data?.products;
}

export async function getProductByHandle(handle: string) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.GET_PRODUCT_BY_HANDLE, {
    variables: { handle },
  });
  return data?.product;
}

export async function getCollectionProducts(handle: string, limit = 50) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.GET_COLLECTION_PRODUCTS, {
    variables: { handle, first: limit },
  });
  return data?.collection;
}

export async function createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.CREATE_CART, {
    variables: { input: { lines } },
  });
  return data?.cartCreate?.cart;
}

export async function addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.ADD_TO_CART, {
    variables: { cartId, lines },
  });
  return data?.cartLinesAdd?.cart;
}

export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.UPDATE_CART_LINES, {
    variables: { cartId, lines },
  });
  return data?.cartLinesUpdate?.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.REMOVE_FROM_CART, {
    variables: { cartId, lineIds },
  });
  return data?.cartLinesRemove?.cart;
}

export async function getCart(cartId: string) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.GET_CART, {
    variables: { id: cartId },
  });
  return data?.cart;
}

export async function searchProducts(query: string, limit = 20) {
  const { data } = await shopifyClient.request(SHOPIFY_QUERIES.SEARCH_PRODUCTS, {
    variables: { query, first: limit },
  });
  return data?.products;
}
