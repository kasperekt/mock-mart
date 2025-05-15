import { NextResponse } from 'next/server';
import { editComment, deleteComment } from '@/services/commentService';
import { getCurrentUser } from '@/services/authService';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Ensure user is authenticated
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (!content || content.trim() === '') {
            return NextResponse.json(
                { error: 'Comment content is required' },
                { status: 400 }
            );
        }

        const commentId = Number((await params).id);
        const updatedComment = await editComment(commentId, user.id, content);

        if (!updatedComment) {
            return NextResponse.json(
                { error: 'Comment not found or you do not have permission to edit it' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('Error editing comment:', error);
        return NextResponse.json(
            { error: 'Failed to edit comment' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Ensure user is authenticated
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const commentId = Number((await params).id);
        const success = await deleteComment(commentId, user.id);

        if (!success) {
            return NextResponse.json(
                { error: 'Comment not found or you do not have permission to delete it' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
} 