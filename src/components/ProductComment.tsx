import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProductCommentProps {
  productId: number;
  onClose: () => void;
  onAddComment: (comment: {
    id?: number;
    content: string;
    username: string;
    created_at: string;
  }) => void;
}

export function ProductComment({ productId, onClose, onAddComment }: ProductCommentProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create an optimistic comment
    const optimisticComment = {
      content: comment,
      username: 'Anonymous User',
      created_at: new Date().toISOString()
    };

    // Add the optimistic comment to the UI immediately
    onAddComment(optimisticComment);
    onClose();

    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      // No need to update UI here as we've already added the optimistic comment
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add a Comment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              required
              className="min-h-[100px]"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 