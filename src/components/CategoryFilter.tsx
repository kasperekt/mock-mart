import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Define a type for category objects that might come from the API
interface CategoryObject {
  name: string;
  [key: string]: any;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  // Ensure categories are strings and trim any whitespace
  const categoryStrings = categories.map(category => {
    if (typeof category === 'string') {
      return category.trim();
    } else if (typeof category === 'object' && category !== null && 'name' in category) {
      return String((category as CategoryObject).name).trim();
    } else {
      return String(category).trim();
    }
  });
  
  // Log the categories for debugging
  console.log('CategoryFilter received categories:', categoryStrings);
  console.log('Selected category:', selectedCategory);
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            selectedCategory === ""
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onCategoryChange("")}
        >
          All
        </button>
        {categoryStrings.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
} 