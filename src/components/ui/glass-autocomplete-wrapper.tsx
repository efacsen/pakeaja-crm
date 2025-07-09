import * as React from "react"
import { cn } from "@/lib/utils"

// Glass-styled wrapper for autocomplete triggers
export function GlassAutocompleteTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        // Base styles
        "flex h-9 w-full items-center justify-between rounded-md px-3 py-2 text-sm shadow-xs transition-all outline-none",
        // Glassmorphism effect
        "bg-white/20 dark:bg-gray-900/50",
        "backdrop-blur-sm backdrop-saturate-150",
        "border border-white/20 dark:border-white/10",
        // Text
        "text-gray-900 dark:text-gray-100",
        // Placeholder state
        "data-[placeholder]:text-gray-600 dark:data-[placeholder]:text-gray-400",
        // Hover and focus states
        "hover:bg-white/30 dark:hover:bg-gray-900/60",
        "focus:bg-white/30 dark:focus:bg-gray-900/60",
        "focus:border-white/30 dark:focus:border-white/20",
        "focus:ring-2 focus:ring-white/20 dark:focus:ring-white/10",
        "focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

// Glass-styled command input
export function GlassCommandInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent px-3 py-2 text-sm outline-none",
        "placeholder:text-gray-600 dark:placeholder:text-gray-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

// Glass-styled popover content wrapper
export function GlassPopoverContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Glassmorphism effect
        "bg-white/80 dark:bg-gray-900/80",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}