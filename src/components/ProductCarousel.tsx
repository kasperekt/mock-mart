import { useState } from "react";
import { Product } from "@/services/productService";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
    products: Product[];
    title?: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 4; // Show 4 products at a time on larger screens

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsToShow >= products.length
                ? 0
                : prevIndex + itemsToShow
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - itemsToShow < 0
                ? Math.max(0, products.length - itemsToShow)
                : prevIndex - itemsToShow
        );
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="w-full py-4">
            {title && (
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            )}

            <div className="relative">
                <div className="flex items-center">
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 z-10 bg-white rounded-full shadow-md hover:bg-gray-100"
                        onClick={prevSlide}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous</span>
                    </Button>

                    <div className="w-full overflow-hidden px-9">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-2"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 z-10 bg-white rounded-full shadow-md hover:bg-gray-100"
                        onClick={nextSlide}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next</span>
                    </Button>
                </div>
            </div>
        </div>
    );
} 