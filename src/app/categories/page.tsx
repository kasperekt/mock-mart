"use client";

import { useState, useEffect } from "react";
import { Product } from "@/services/productService";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";

interface CategoryGroup {
  name: string;
  products: Product[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch all products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const products: Product[] = await productsResponse.json();

        // Group products by category
        const groupedProducts = products.reduce((acc: CategoryGroup[], product) => {
          const existingCategory = acc.find(cat => cat.name === product.category);
          if (existingCategory) {
            existingCategory.products.push(product);
          } else {
            acc.push({
              name: product.category,
              products: [product]
            });
          }
          return acc;
        }, []);

        setCategories(groupedProducts);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to All Products
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => (
                <div key={category.name} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 capitalize">
                      {category.name}
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="group"
                        >
                          <div className="bg-white border rounded-lg overflow-hidden transition-shadow hover:shadow-lg">
                            <div className="relative aspect-square">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-contain p-4"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                  No image available
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                                {product.title}
                              </h3>
                              <p className="mt-2 text-xl font-bold text-blue-600">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 