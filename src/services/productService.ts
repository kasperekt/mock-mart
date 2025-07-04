import { db } from "../db";
import { products, ratings } from "../db/schema";
import { eq, like, sql, and } from "drizzle-orm";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string | null;
  category: string;
  image: string | null;
  rating: {
    rate: number; // average
    count: number;
  };
}

async function getProductRating(productId: number) {
  const rows = await db.select({
    avg: sql`AVG(rating) as avg`,
    count: sql`COUNT(*) as count`
  }).from(ratings).where(eq(ratings.productId, productId));
  const avg = rows[0]?.avg ? Number(rows[0].avg) : 0;
  const count = rows[0]?.count ? Number(rows[0].count) : 0;
  return { rate: avg, count };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.select().from(products);
  const productsWithRatings = await Promise.all(rows.map(async row => {
    const rating = await getProductRating(row.id);
    return {
      id: row.id,
      title: row.name,
      price: Number(row.price),
      description: row.description,
      category: row.category,
      image: row.image,
      rating
    };
  }));
  return productsWithRatings;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await db.select().from(products).where(eq(products.category, category));
  const productsWithRatings = await Promise.all(rows.map(async row => {
    const rating = await getProductRating(row.id);
    return {
      id: row.id,
      title: row.name,
      price: Number(row.price),
      description: row.description,
      category: row.category,
      image: row.image,
      rating
    };
  }));
  return productsWithRatings;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const searchQuery = `%${query}%`;
  const rows = await db.select().from(products).where(
    like(products.name, searchQuery)
  );
  const productsWithRatings = await Promise.all(rows.map(async row => {
    const rating = await getProductRating(row.id);
    return {
      id: row.id,
      title: row.name,
      price: Number(row.price),
      description: row.description,
      category: row.category,
      image: row.image,
      rating
    };
  }));
  return productsWithRatings;
}

export async function getAllCategories(): Promise<string[]> {
  // This assumes a categories table exists in schema, otherwise adjust accordingly
  // If categories are derived from products, use:
  const rows = await db.select({ category: products.category }).from(products).groupBy(products.category);
  return rows.map(row => row.category);
}

export async function getProduct(id: number): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.id, id));
  if (rows.length === 0) return null;
  const row = rows[0];
  const rating = await getProductRating(row.id);
  return {
    id: row.id,
    title: row.name,
    price: Number(row.price),
    description: row.description,
    category: row.category,
    image: row.image,
    rating
  };
}

export async function getProductsWithFilters(
  searchQuery?: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  minRating?: number
): Promise<Product[]> {
  const conditions = [];

  // Add search condition
  if (searchQuery) {
    conditions.push(like(products.name, `%${searchQuery}%`));
  }

  // Add category condition
  if (category) {
    conditions.push(eq(products.category, category));
  }

  // Add price conditions
  if (minPrice !== undefined) {
    conditions.push(sql`${products.price} >= ${minPrice}`);
  }

  if (maxPrice !== undefined) {
    conditions.push(sql`${products.price} <= ${maxPrice}`);
  }

  // Build the where clause
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Execute query
  const rows = whereClause
    ? await db.select().from(products).where(whereClause)
    : await db.select().from(products);

  // Add ratings to each product
  const productsWithRatings = await Promise.all(rows.map(async row => {
    const rating = await getProductRating(row.id);
    return {
      id: row.id,
      title: row.name,
      price: Number(row.price),
      description: row.description,
      category: row.category,
      image: row.image,
      rating
    };
  }));

  // Filter by minimum rating if specified
  const filteredByRating = minRating !== undefined
    ? productsWithRatings.filter(product => product.rating.rate >= minRating)
    : productsWithRatings;

  return filteredByRating;
} 