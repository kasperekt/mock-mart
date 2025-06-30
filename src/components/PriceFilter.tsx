import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
    onPriceFilter: (minPrice: number | null, maxPrice: number | null) => void;
    minPrice?: number | null;
    maxPrice?: number | null;
}

export function PriceFilter({ onPriceFilter, minPrice = null, maxPrice = null }: PriceFilterProps) {
    const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() || "");
    const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() || "");

    // Predefined price ranges
    const priceRanges = [
        { label: "Under $25", min: null, max: 25 },
        { label: "$25 - $50", min: 25, max: 50 },
        { label: "$50 - $100", min: 50, max: 100 },
        { label: "$100 - $200", min: 100, max: 200 },
        { label: "Over $200", min: 200, max: null },
    ];

    const handleApplyFilter = () => {
        const min = localMinPrice ? parseFloat(localMinPrice) : null;
        const max = localMaxPrice ? parseFloat(localMaxPrice) : null;

        // Validate that min is not greater than max
        if (min !== null && max !== null && min > max) {
            alert("Minimum price cannot be greater than maximum price");
            return;
        }

        onPriceFilter(min, max);
    };

    const handleClearFilter = () => {
        setLocalMinPrice("");
        setLocalMaxPrice("");
        onPriceFilter(null, null);
    };

    const handlePriceRangeClick = (min: number | null, max: number | null) => {
        setLocalMinPrice(min?.toString() || "");
        setLocalMaxPrice(max?.toString() || "");
        onPriceFilter(min, max);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Price</h3>

            {/* Predefined Price Ranges */}
            <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick Filters</Label>
                <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePriceRangeClick(range.min, range.max)}
                            className="text-xs"
                        >
                            {range.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Custom Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="minPrice" className="text-sm font-medium text-gray-700">
                        Min Price ($)
                    </Label>
                    <Input
                        id="minPrice"
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">
                        Max Price ($)
                    </Label>
                    <Input
                        id="maxPrice"
                        type="number"
                        placeholder="No limit"
                        min="0"
                        step="0.01"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-2">
                <Button onClick={handleApplyFilter} size="sm">
                    Apply Filter
                </Button>
                <Button onClick={handleClearFilter} variant="outline" size="sm">
                    Clear
                </Button>
            </div>

            {/* Current Filter Display */}
            {(minPrice !== null || maxPrice !== null) && (
                <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Active filter: </span>
                    {minPrice !== null && maxPrice !== null
                        ? `$${minPrice} - $${maxPrice}`
                        : minPrice !== null
                            ? `$${minPrice}+`
                            : `Under $${maxPrice}`}
                </div>
            )}
        </div>
    );
} 