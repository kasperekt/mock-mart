import { NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory, searchProducts } from '@/services/productService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    let products;
    if (category) {
      products = await getProductsByCategory(category);
    } else if (query) {
      products = await searchProducts(query);
    } else {
      products = await getAllProducts();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 