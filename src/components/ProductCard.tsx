import { Product } from "@/services/productService";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="flex flex-col h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-sm">No image available</div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={`star-${product.id}-${i}`}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating.rate)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 