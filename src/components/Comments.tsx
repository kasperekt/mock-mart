import { Comment as BaseComment, getCommentsByProductId } from "@/services/commentService";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface CommentsProps {
  productId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Comment extends BaseComment {
  username?: string;
}

export function Comments({ productId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    fetchComments();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await getCommentsByProductId(productId);

      // Fetch user information for comments
      const usersMap = new Map();
      const commentsWithUsernames = await Promise.all(
        fetchedComments.map(async (comment: Comment) => {
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

      setComments(commentsWithUsernames);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add comment');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to add comment');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      
      {!loadingAuth && user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Comment'}
          </Button>
        </form>
      ) : (
        <p className="text-gray-500">Please log in to leave a comment</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.username || comment.userId}`} />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{comment.username || 'Anonymous User'}</p>
                <p className="text-sm text-gray-500">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                </p>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 