import { NextResponse } from 'next/server';
import { getProduct } from '@/services/productService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = await Promise.resolve(params.id);
    const product = await getProduct(Number(productId));
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 