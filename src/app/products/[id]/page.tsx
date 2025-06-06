"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product } from "@/services/productService";
import Navigation from "@/components/Navigation";
import { Rating } from "@/components/Rating";
import Image from "next/image";
import { ProductComment } from "@/components/ProductComment";
import { EditCommentModal } from "@/components/EditCommentModal";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface Comment {
  id?: number;
  productId: number;
  userId: number;
  content: string;
  createdAt: Date | null | string;
  username?: string; // Optional for backward compatibility
  created_at?: string; // Optional for backward compatibility
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function ProductDetails() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchProductAndComments = async () => {
      try {
        setLoading(true);
        const [productRes, commentsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/products/${productId}/comments`)
        ]);
        
        if (!productRes.ok || !commentsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const [productData, commentsData] = await Promise.all([
          productRes.json(),
          commentsRes.json()
        ]);
        
        // Fetch user information for comments
        const usersMap = new Map();
        const commentUsers = await Promise.all(
          commentsData.map(async (comment: Comment) => {
            try {
              if (!usersMap.has(comment.userId)) {
                const userRes = await fetch(`/api/users/${comment.userId}`);
                if (userRes.ok) {
                  const userData = await userRes.json();
                  usersMap.set(comment.userId, userData.name);
                }
              }
              return {
                ...comment,
                username: usersMap.get(comment.userId) || 'Anonymous User'
              };
            } catch (error) {
              console.error(`Error fetching user for comment ${comment.id}:`, error);
              return {
                ...comment,
                username: 'Anonymous User'
              };
            }
          })
        );

        setProduct(productData);
        setComments(commentUsers);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductAndComments();
    }
  }, [productId]);

  const handleAddComment = (newComment: Comment) => {
    // Add the new comment to the beginning of the list
    setComments(prevComments => [newComment, ...prevComments]);
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditingComment({ id: commentId, content });
  };

  const handleUpdateComment = (updatedComment: { id: number; content: string }) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === updatedComment.id
          ? { ...comment, content: updatedComment.content }
          : comment
      )
    );
    setEditingComment(null);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete comment');
      }

      // Remove the deleted comment from the list
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
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
              Back to Products
            </Link>
          </div>
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading product details...</p>
            </div>
          ) : product ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative aspect-square">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No image available
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                  <p className="text-gray-600 mb-4 capitalize">{product.category}</p>
                  
                  <div className="mb-6">
                    <Rating
                      productId={product.id}
                      initialRating={product.rating.rate}
                      ratingCount={product.rating.count}
                    />
                  </div>

                  <p className="text-2xl font-bold text-blue-600 mb-6">
                    ${product.price.toFixed(2)}
                  </p>

                  <p className="text-gray-700 mb-8">{product.description}</p>

                  <div className="space-y-4">
                    <Button
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        // TODO: Implement add to cart functionality
                        alert("Add to cart functionality coming soon!");
                      }}
                    >
                      Add to Cart
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowComment(true)}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Comments</h2>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <div key={comment.id || `temp-${index}`} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{comment.username}</span>
                          <span className="text-sm text-gray-500">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString()
                              : comment.created_at
                                ? new Date(comment.created_at).toLocaleDateString()
                                : new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>

                        {/* Show edit/delete buttons only for comments by the current user */}
                        {currentUser && comment.userId === currentUser.id && comment.id && (
                          <div className="mt-2 flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditComment(comment.id!, comment.content)}
                              className="flex items-center gap-1 text-xs"
                            >
                              <Edit2 className="h-3 w-3" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id!)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Product not found.</p>
            </div>
          )}
        </div>
      </main>
      
      {showComment && product && (
        <ProductComment
          productId={product.id}
          onClose={() => setShowComment(false)}
          onAddComment={handleAddComment}
        />
      )}
      
      {editingComment && (
        <EditCommentModal
          commentId={editingComment.id}
          initialContent={editingComment.content}
          onClose={() => setEditingComment(null)}
          onCommentUpdated={handleUpdateComment}
        />
      )}

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