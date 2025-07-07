'use client';

import { useState } from 'react';
import { Lead } from '@/types/sales';
import { 
  MapPin, 
  Paperclip, 
  MessageSquare, 
  Clock,
  MoreVertical,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
}

export function LeadCard({ lead, onEdit, onDelete, isDragging }: LeadCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompanyColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-green-500',
      'bg-indigo-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;
    
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-card border border-border rounded-xl p-4 cursor-grab",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "card-hover",
        isSortableDragging && "dragging cursor-grabbing",
        isDragging && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Logo and Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {lead.company_logo ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={lead.company_logo} alt={lead.company_name} />
              <AvatarFallback>{getInitials(lead.company_name)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold",
              getCompanyColor(lead.company_name)
            )}>
              {getInitials(lead.company_name)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">
              {lead.company_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lead.contact_name}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "p-1 rounded hover:bg-accent transition-colors",
              "opacity-0 group-hover:opacity-100",
              isHovered && "opacity-100"
            )}>
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(lead)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(lead.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(lead.value)}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span className="text-sm line-clamp-1">{lead.location}</span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= lead.rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            )}
          />
        ))}
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5" />
            <span className="text-xs">{lead.files_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">{lead.comments_count}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Assigned Users */}
          <div className="flex -space-x-2">
            {lead.assigned_users.slice(0, 3).map((user, index) => (
              <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {lead.assigned_users.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                <span className="text-xs text-muted-foreground">
                  +{lead.assigned_users.length - 3}
                </span>
              </div>
            )}
          </div>

          {/* Last Activity */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">
              {formatLastActivity(lead.last_activity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}