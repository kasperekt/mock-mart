import { NextResponse } from 'next/server';
import { getProductsWithFilters } from '@/services/productService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const query = searchParams.get('query') || undefined;
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const minRatingParam = searchParams.get('minRating');

    // Parse price parameters
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
    const minRating = minRatingParam ? parseFloat(minRatingParam) : undefined;

    // Validate price parameters
    if (minPriceParam && isNaN(minPrice as number)) {
      return NextResponse.json(
        { error: 'Invalid minPrice parameter' },
        { status: 400 }
      );
    }

    if (maxPriceParam && isNaN(maxPrice as number)) {
      return NextResponse.json(
        { error: 'Invalid maxPrice parameter' },
        { status: 400 }
      );
    }

    // Validate rating parameter
    if (minRatingParam && isNaN(minRating as number)) {
      return NextResponse.json(
        { error: 'Invalid minRating parameter' },
        { status: 400 }
      );
    }

    if (minRating !== undefined && (minRating < 0 || minRating > 5)) {
      return NextResponse.json(
        { error: 'minRating must be between 0 and 5' },
        { status: 400 }
      );
    }

    // Use the new filtering function
    const products = await getProductsWithFilters(query, category, minPrice, maxPrice, minRating);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 