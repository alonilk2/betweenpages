import { NextRequest, NextResponse } from 'next/server';
import { buildCheckoutUrl } from '../../../../../lib/shopify';

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const variantId = searchParams.get('variantId');
  const quantityParam = searchParams.get('q');
  const quantity = Math.max(1, parseInt(quantityParam || '1', 10));

  if (!variantId) {
    return NextResponse.json({ error: 'variantId missing' }, { status: 400 });
  }
  const checkout = buildCheckoutUrl(variantId, quantity);
  if (!checkout) {
    return NextResponse.json(
      { error: 'Checkout unavailable' },
      { status: 500 }
    );
  }
  return NextResponse.redirect(checkout);
}
