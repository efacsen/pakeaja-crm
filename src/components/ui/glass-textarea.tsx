import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm shadow-xs transition-all outline-none resize-y",
          // Glassmorphism effect
          "bg-white/10 dark:bg-gray-900/30",
          "backdrop-blur-sm backdrop-saturate-150",
          "border border-white/20 dark:border-white/10",
          // Text and placeholder
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-600 dark:placeholder:text-gray-400",
          // Selection
          "selection:bg-primary selection:text-primary-foreground",
          // Focus states with enhanced glass effect
          "focus-visible:bg-white/20 dark:focus-visible:bg-gray-900/40",
          "focus-visible:border-white/30 dark:focus-visible:border-white/20",
          "focus-visible:ring-2 focus-visible:ring-white/20 dark:focus-visible:ring-white/10",
          "focus-visible:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
          // Disabled state
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          // Error state
          "aria-invalid:border-red-500/50 dark:aria-invalid:border-red-400/50",
          "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-400/20",
          // Scrollbar styling
          "scrollbar-thin scrollbar-thumb-white/20 dark:scrollbar-thumb-white/10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassTextarea.displayName = "GlassTextarea"

// Solid variant with stronger background for better contrast
const GlassTextareaSolid = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <GlassTextarea
        ref={ref}
        className={cn(
          "bg-white/20 dark:bg-gray-900/50",
          "focus-visible:bg-white/30 dark:focus-visible:bg-gray-900/60",
          className
        )}
        {...props}
      />
    )
  }
)
GlassTextareaSolid.displayName = "GlassTextareaSolid"

export { GlassTextarea, GlassTextareaSolid }