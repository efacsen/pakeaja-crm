'use client';

import { useState, useEffect } from 'react';
import { Comment, CreateCommentRequest } from '@/types/comments';
import { CommentItem } from './CommentItem';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommentsSectionProps {
  leadId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: 'sales_rep' | 'sales_manager' | 'admin';
  onCommentAdded?: (comment: Comment) => void;
}

// Mock service for comments
const mockCommentService = {
  async getComments(leadId: string): Promise<Comment[]> {
    // In a real app, this would fetch from the API
    return [];
  },

  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      lead_id: data.lead_id,
      parent_id: data.parent_id,
      author_id: 'current_user',
      author_name: 'Current User',
      author_role: 'sales_rep',
      content: data.content,
      mentions: data.mentions || [],
      is_edited: false,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      replies: [],
      reply_count: 0
    };
    return newComment;
  },

  async updateComment(commentId: string, content: string): Promise<Comment> {
    // Mock update
    return {} as Comment;
  },

  async deleteComment(commentId: string): Promise<void> {
    // Mock delete
  }
};

export function CommentsSection({
  leadId,
  currentUserId,
  currentUserName,
  currentUserRole,
  onCommentAdded
}: CommentsSectionProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [leadId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await mockCommentService.getComments(leadId);
      setComments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await mockCommentService.createComment({
        lead_id: leadId,
        content: newComment
      });

      // Update local state
      setComments([comment, ...comments]);
      setNewComment('');
      
      // Notify parent
      onCommentAdded?.(comment);

      toast({
        title: 'Comment added',
        description: 'Your comment has been posted'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (content: string, parentId: string) => {
    try {
      const reply = await mockCommentService.createComment({
        lead_id: leadId,
        content,
        parent_id: parentId
      });

      // Update comments with new reply
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
            reply_count: (comment.reply_count || 0) + 1
          };
        }
        return comment;
      }));

      toast({
        title: 'Reply added',
        description: 'Your reply has been posted'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add reply',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await mockCommentService.updateComment(commentId, content);

      // Update local state
      const updateCommentRecursive = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content,
              is_edited: true,
              edited_at: new Date().toISOString()
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentRecursive(comment.replies)
            };
          }
          return comment;
        });
      };

      setComments(updateCommentRecursive(comments));

      toast({
        title: 'Comment updated',
        description: 'Your comment has been edited'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update comment',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await mockCommentService.deleteComment(commentId);

      // Update local state
      const deleteCommentRecursive = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_deleted: true,
              content: ''
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: deleteCommentRecursive(comment.replies)
            };
          }
          return comment;
        });
      };

      setComments(deleteCommentRecursive(comments));

      toast({
        title: 'Comment deleted',
        description: 'Your comment has been removed'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-semibold">Comments</h3>
          {comments.length > 0 && (
            <Badge variant="secondary">{comments.length}</Badge>
          )}
        </div>
      </div>

      {/* New comment form */}
      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment... Use @ to mention someone"
          className="min-h-[80px]"
          disabled={submitting}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Post Comment
          </Button>
        </div>
      </div>

      <Separator />

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No comments yet</p>
          <p className="text-xs mt-1">Be the first to comment on this deal</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}