import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const GlassSelect = SelectPrimitive.Root

const GlassSelectGroup = SelectPrimitive.Group

const GlassSelectValue = SelectPrimitive.Value

const GlassSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styles
      "flex h-9 w-full items-center justify-between rounded-md px-3 py-2 text-sm shadow-xs transition-all outline-none",
      // Glassmorphism effect
      "bg-white/10 dark:bg-gray-900/30",
      "backdrop-blur-sm backdrop-saturate-150",
      "border border-white/20 dark:border-white/10",
      // Text
      "text-gray-900 dark:text-gray-100",
      // Placeholder state
      "data-[placeholder]:text-gray-600 dark:data-[placeholder]:text-gray-400",
      // Focus states
      "focus:bg-white/20 dark:focus:bg-gray-900/40",
      "focus:border-white/30 dark:focus:border-white/20",
      "focus:ring-2 focus:ring-white/20 dark:focus:ring-white/10",
      "focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
GlassSelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const GlassSelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
GlassSelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const GlassSelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
GlassSelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const GlassSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Base styles
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md shadow-lg",
        // Glassmorphism effect
        "bg-white/80 dark:bg-gray-900/80",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-white/10",
        // Text
        "text-gray-900 dark:text-gray-100",
        // Animation
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <GlassSelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <GlassSelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
GlassSelectContent.displayName = SelectPrimitive.Content.displayName

const GlassSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
GlassSelectLabel.displayName = SelectPrimitive.Label.displayName

const GlassSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "hover:bg-white/20 dark:hover:bg-gray-800/20",
      "focus:bg-white/20 dark:focus:bg-gray-800/20",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
GlassSelectItem.displayName = SelectPrimitive.Item.displayName

const GlassSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-white/20 dark:bg-white/10", className)}
    {...props}
  />
))
GlassSelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Solid variant exports for better contrast
const GlassSelectTriggerSolid = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <GlassSelectTrigger
    ref={ref}
    className={cn(
      "bg-white/20 dark:bg-gray-900/50",
      "focus:bg-white/30 dark:focus:bg-gray-900/60",
      className
    )}
    {...props}
  />
))
GlassSelectTriggerSolid.displayName = "GlassSelectTriggerSolid"

export {
  GlassSelect,
  GlassSelectGroup,
  GlassSelectValue,
  GlassSelectTrigger,
  GlassSelectContent,
  GlassSelectLabel,
  GlassSelectItem,
  GlassSelectSeparator,
  GlassSelectScrollUpButton,
  GlassSelectScrollDownButton,
  GlassSelectTriggerSolid,
}