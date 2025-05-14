import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function ProductComment({ productId, onClose, onAddComment }: ProductCommentProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoadingAuth(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setError('You must be logged in to post a comment');
      return;
    }

    setLoading(true);
    setError(null);

    // Create an optimistic comment
    const optimisticComment = {
      content: comment,
      username: user.name || 'Anonymous User',
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
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      // No need to update UI here as we've already added the optimistic comment
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add a Comment</h2>
        
        {!loadingAuth && !user && (
          <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
            <AlertDescription>
              You must be logged in to post a comment
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              required
              className="min-h-[100px]"
              disabled={!user || loading}
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
              disabled={!user || loading}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 