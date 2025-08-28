# בין הדפים – אתר המלצות ספרים

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Shopify Integration (Headless Purchase Links)

This project includes an optional lightweight integration with the Shopify Storefront API to display purchase buttons on book pages.

### 1. Environment Variables

Add the following to a `.env.local` file (never commit private tokens):

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=public_storefront_access_token
```

The token must be a Storefront API public token (Settings > Apps & sales channels > Develop apps > Storefront API). Do **not** use Admin API tokens.

### 2. Add Shopify Handle to a Book

Edit a book JSON in `content/books/*.json` and add:

```json
"shopifyHandle": "product-handle"
```

During `next build`, the page will fetch the product and render variant purchase buttons.

### 3. How It Works

- `lib/shopify.ts` fetches product data at build time (static) / on-demand with ISR caching.
- `shopifyHandle` triggers a GraphQL query for product + variants.
- Buttons POST to `/api/shopify/redirect` which redirects the user to the Shopify cart with the chosen variant.

### 4. Security Notes

- Only public Storefront token is exposed client-side.
- No sensitive admin mutations are performed.
- Remove `shopifyHandle` to hide purchase UI.

### 5. Future Enhancements (Ideas)

- Persist mini-cart across pages (needs server / client storage strategy)
- Batch add multiple variants
- Show real-time inventory (requires dynamic revalidation)
