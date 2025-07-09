import * as React from "react"
import { cn } from "@/lib/utils"

// Glassmorphism Card Components with modern glass effect

function GlassCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card"
      className={cn(
        // Base styles
        "flex flex-col gap-6 rounded-xl py-6",
        // Glassmorphism effect
        "bg-white/10 dark:bg-gray-900/30",
        "backdrop-blur-md backdrop-saturate-150",
        "border border-white/20 dark:border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        // Hover effect
        "transition-all duration-300",
        "hover:bg-white/20 dark:hover:bg-gray-900/40",
        "hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
        className
      )}
      {...props}
    />
  )
}

function GlassCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function GlassCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-title"
      className={cn(
        "leading-none font-semibold",
        "text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    />
  )
}

function GlassCardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-description"
      className={cn(
        "text-sm",
        "text-gray-600 dark:text-gray-400",
        className
      )}
      {...props}
    />
  )
}

function GlassCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function GlassCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function GlassCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-footer"
      className={cn(
        "flex items-center px-6",
        "[.border-t]:pt-6",
        "border-t border-white/10 dark:border-white/5",
        className
      )}
      {...props}
    />
  )
}

// Specific glassmorphism variants

function GlassCardSolid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <GlassCard
      className={cn(
        "bg-white/20 dark:bg-gray-900/50",
        "hover:bg-white/30 dark:hover:bg-gray-900/60",
        className
      )}
      {...props}
    />
  )
}

function GlassCardLight({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <GlassCard
      className={cn(
        "bg-white/5 dark:bg-gray-900/20",
        "hover:bg-white/10 dark:hover:bg-gray-900/30",
        className
      )}
      {...props}
    />
  )
}

export {
  GlassCard,
  GlassCardHeader,
  GlassCardFooter,
  GlassCardTitle,
  GlassCardAction,
  GlassCardDescription,
  GlassCardContent,
  GlassCardSolid,
  GlassCardLight,
}