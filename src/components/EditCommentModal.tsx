import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { X } from "lucide-react";

interface EditCommentModalProps {
    commentId: number;
    initialContent: string;
    onClose: () => void;
    onCommentUpdated: (updatedComment: {
        id: number;
        content: string;
        updatedAt?: string;
    }) => void;
}

export function EditCommentModal({ commentId, initialContent, onClose, onCommentUpdated }: EditCommentModalProps) {
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update comment');
            }

            const updatedComment = await response.json();
            onCommentUpdated(updatedComment);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update comment. Please try again.');
            console.error('Error updating comment:', err);
        } finally {
            setLoading(false);
        }
    };

    // Close on escape key press
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Edit Comment</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="mb-4">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Your comment"
                            className="w-full p-2 border rounded"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Comment'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 