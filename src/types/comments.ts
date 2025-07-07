export interface Comment {
  id: string;
  lead_id: string;
  parent_id?: string; // For threaded replies
  
  // Author info
  author_id: string;
  author_name: string;
  author_role: 'sales_rep' | 'sales_manager' | 'admin';
  
  // Content
  content: string;
  mentions?: string[]; // Array of user IDs mentioned
  
  // Status
  is_edited: boolean;
  is_deleted: boolean;
  edited_at?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // Nested data
  replies?: Comment[];
  reply_count?: number;
}

export interface CommentNotification {
  id: string;
  comment_id: string;
  lead_id: string;
  recipient_id: string;
  
  // Notification details
  type: 'mention' | 'reply' | 'new_comment';
  is_read: boolean;
  read_at?: string;
  
  // Context
  lead_name: string;
  author_name: string;
  comment_preview: string;
  
  // Metadata
  created_at: string;
}

export interface CreateCommentRequest {
  lead_id: string;
  content: string;
  parent_id?: string;
  mentions?: string[];
}

export interface CommentThread {
  parent: Comment;
  replies: Comment[];
  total_replies: number;
  has_more: boolean;
}