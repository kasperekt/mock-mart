"use client";

import { useState, useEffect } from "react";
import { Product } from "@/services/productService";
import Navigation from "@/components/Navigation";
import { ProductCarousel } from "@/components/ProductCarousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await response.json();

        // Create featured products (random selection of 8 products)
        const shuffled = [...productsData].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 8));

        // Create new arrivals (another random selection of 8 different products)
        const remaining = shuffled.slice(8);
        setNewArrivals(remaining.slice(0, 8));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Featured Products</h2>
                  <Link href="/products">
                    <Button variant="outline">View All Products</Button>
                  </Link>
                </div>
                <ProductCarousel products={featuredProducts} />
              </div>

              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">New Arrivals</h2>
                  <Link href="/products">
                    <Button variant="outline">View All Products</Button>
                  </Link>
                </div>
                  <ProductCarousel products={newArrivals} />
                </div>
              </>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} MockMart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
