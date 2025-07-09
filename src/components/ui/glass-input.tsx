import * as React from "react"
import { cn } from "@/lib/utils"

function GlassInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="glass-input"
      className={cn(
        // Base styles
        "flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-all outline-none md:text-sm",
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
        // File input styles
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Error state
        "aria-invalid:border-red-500/50 dark:aria-invalid:border-red-400/50",
        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-400/20",
        className
      )}
      {...props}
    />
  )
}

// Solid variant with stronger background for better contrast in forms
function GlassInputSolid({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <GlassInput
      className={cn(
        "bg-white/20 dark:bg-gray-900/50",
        "focus-visible:bg-white/30 dark:focus-visible:bg-gray-900/60",
        className
      )}
      {...props}
    />
  )
}

export { GlassInput, GlassInputSolid }