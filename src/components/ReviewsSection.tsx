"use client";
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Review {
    id: number
    author: string
    date: string
    rating: number
    comment: string
}

interface ReviewsSectionProps {
    reviews: Review[]
    totalReviews: number
}

export default function ReviewsSection({ reviews, totalReviews }: ReviewsSectionProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium">İncelemeler ({totalReviews})</h2>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                >
                    İnceleme Yaz
                </Button>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  {review.author.split(' ').map(part =>
                      part.charAt(0) + '***' + part.charAt(part.length - 1)
                  ).join(' ')}
                </span>
                                <span className="text-sm text-gray-500">
                  {review.date}
                </span>
                            </div>
                            <div className="flex">
                                {Array(review.rating).fill(0).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-current"
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>

            {totalReviews > reviews.length && (
                <button
                    className="w-full text-center text-red-500 hover:text-red-600 text-sm mt-4"
                >
                    Daha Fazla Yorum Göster ({totalReviews - reviews.length})
                </button>
            )}
        </div>
    )
}
