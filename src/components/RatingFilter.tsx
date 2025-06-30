import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface RatingFilterProps {
    onRatingFilter: (minRating: number | null) => void;
    minRating?: number | null;
}

// Star component for visual rating display
function StarIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            className={`w-4 h-4 ${filled ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

// Star rating display component
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<StarIcon key={i} filled={i <= rating} />);
    }
    return <div className={`flex ${size === "md" ? "gap-1" : "gap-0.5"}`}>{stars}</div>;
}

export function RatingFilter({ onRatingFilter, minRating = null }: RatingFilterProps) {
    const [localMinRating, setLocalMinRating] = useState<number | null>(minRating);

    // Predefined rating options
    const ratingOptions = [
        { label: "4+ Stars", value: 4, description: "4 stars and above" },
        { label: "3+ Stars", value: 3, description: "3 stars and above" },
        { label: "2+ Stars", value: 2, description: "2 stars and above" },
        { label: "1+ Stars", value: 1, description: "1 star and above" },
    ];

    const handleRatingSelect = (rating: number | null) => {
        setLocalMinRating(rating);
        onRatingFilter(rating);
    };

    const handleClearFilter = () => {
        setLocalMinRating(null);
        onRatingFilter(null);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Rating</h3>

            {/* Rating Options */}
            <div className="space-y-3 mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</Label>
                {ratingOptions.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                        <Button
                            variant={localMinRating === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleRatingSelect(option.value)}
                            className="flex items-center gap-2 min-w-[120px] justify-start"
                        >
                            <StarRating rating={option.value} />
                            <span className="text-sm">{option.label}</span>
                        </Button>
                    </div>
                ))}
            </div>

            {/* All Ratings Option */}
            <div className="flex items-center gap-3 mb-4">
                <Button
                    variant={localMinRating === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRatingSelect(null)}
                    className="min-w-[120px] justify-start"
                >
                    All Ratings
                </Button>
            </div>

            {/* Clear Filter Button */}
            {localMinRating !== null && (
                <div className="pt-3 border-t border-gray-200">
                    <Button onClick={handleClearFilter} variant="outline" size="sm">
                        Clear Rating Filter
                    </Button>
                </div>
            )}

            {/* Current Filter Display */}
            {localMinRating !== null && (
                <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Active filter: </span>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={localMinRating} />
                        <span>{localMinRating}+ stars and above</span>
                    </div>
                </div>
            )}
        </div>
    );
} 