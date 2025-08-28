// Lightweight Shopify Storefront API helper (client-side safe for public product queries)
// NOTE: This project is static (no server). We only perform unauthenticated product queries
// via Storefront public API using a public token. Do NOT expose private admin tokens.

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: string; // decimal string
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  onlineStoreUrl?: string;
  featuredImage?: { url: string; altText?: string } | null;
  variants: ShopifyProductVariant[];
}

interface StorefrontResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN; // public Storefront access token

if (typeof window !== 'undefined') {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    // eslint-disable-next-line no-console
    console.warn('Shopify env vars missing: product purchasing disabled.');
  }
}

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T | null> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) return null;
  try {
    const res = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
        // cache for ISR-like behavior; adjust if needed
        next: { revalidate: 60 * 60 },
      }
    );
    const json: StorefrontResponse<T> = await res.json();
    if (json.errors) {
      console.error('Shopify errors', json.errors);
      return null;
    }
    return json.data || null;
  } catch (e) {
    console.error('Shopify fetch failed', e);
    return null;
  }
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const query = /* GraphQL */ `
    #graphql
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        onlineStoreUrl
        featuredImage {
          url
          altText
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price: priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;
  interface RawVariant {
    node: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
    };
  }
  interface RawData {
    product: {
      id: string;
      title: string;
      description: string;
      handle: string;
      onlineStoreUrl?: string;
      featuredImage?: { url: string; altText?: string } | null;
      variants: { edges: RawVariant[] };
    };
  }
  const data = await storefrontFetch<RawData>(query, { handle });
  if (!data || !data.product) return null;
  const variants: ShopifyProductVariant[] = data.product.variants.edges.map(
    (v) => ({
      id: v.node.id,
      title: v.node.title,
      availableForSale: v.node.availableForSale,
      price: v.node.price.amount,
    })
  );
  return {
    id: data.product.id,
    title: data.product.title,
    description: data.product.description,
    handle: data.product.handle,
    onlineStoreUrl: data.product.onlineStoreUrl,
    featuredImage: data.product.featuredImage || null,
    variants,
  };
}

// Builds a checkout URL for a single variant & quantity using the online store (no cart persistence here)
export function buildCheckoutUrl(
  variantId: string,
  quantity: number = 1
): string | null {
  if (!SHOPIFY_DOMAIN) return null;
  // For headless we can rely on standard /cart URL with variantId (gid) encoded base64 ID
  const encoded = encodeURIComponent(`${variantId}:${quantity}`); // fallback simple pattern
  return `https://${SHOPIFY_DOMAIN}/cart/${encoded}`;
}
