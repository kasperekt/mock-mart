import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export async function getProducts() {
  return await db.select().from(products);
}

export async function getProduct(id: number) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id));
  return result[0];
}

export async function createProduct(product: NewProduct) {
  const result = await db.insert(products).values(product);
  return result;
}

export async function updateProduct(id: number, product: Partial<NewProduct>) {
  const result = await db
    .update(products)
    .set(product)
    .where(eq(products.id, id));
  return result;
}

export async function deleteProduct(id: number) {
  const result = await db
    .delete(products)
    .where(eq(products.id, id));
  return result;
} 