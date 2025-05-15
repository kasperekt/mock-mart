"use client";

import { useState, useEffect } from "react";
import { Product } from "@/services/productService";
import { ProductCard } from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";

export default function ProductsPage() {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error('Failed to fetch initial data');
                }

                const [productsData, categoriesData] = await Promise.all([
                    productsRes.json(),
                    categoriesRes.json()
                ]);

                // Ensure categories are strings
                const categoryStrings = Array.isArray(categoriesData)
                    ? categoriesData.map(cat => typeof cat === 'string' ? cat : String(cat))
                    : [];

                setFilteredProducts(productsData);
                setCategories(categoryStrings);
            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Handle search and category filtering
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                if (searchQuery) params.append('query', searchQuery);
                if (selectedCategory) params.append('category', selectedCategory);

                const response = await fetch(`/api/products?${params}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch filtered products');
                }

                const data = await response.json();
                setFilteredProducts(data);
            } catch (err) {
                console.error("Error filtering products:", err);
                setError("Failed to filter products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredProducts();
    }, [searchQuery, selectedCategory]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h2 className="text-xl font-semibold mb-4 md:mb-0">All Products</h2>
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />

                    {error && (
                        <div className="text-center py-12">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
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