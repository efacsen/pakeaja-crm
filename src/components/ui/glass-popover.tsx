"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

const GlassPopover = PopoverPrimitive.Root

const GlassPopoverTrigger = PopoverPrimitive.Trigger

const GlassPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // Very high z-index to ensure it appears above dialogs
        "z-[9999] w-72 rounded-md p-4 shadow-lg outline-none",
        // Glassmorphism effect
        "bg-white/80 dark:bg-gray-900/80",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-white/10",
        // Text color
        "text-popover-foreground",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      // Ensure it renders above everything else
      style={{ zIndex: 9999 }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
GlassPopoverContent.displayName = PopoverPrimitive.Content.displayName

export { GlassPopover, GlassPopoverTrigger, GlassPopoverContent }