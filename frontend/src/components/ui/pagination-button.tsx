import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { clsxInputs } from "@/lib/clsxInputs";

export interface PaginationItemButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const PaginationItemButton = React.forwardRef<
  HTMLButtonElement,
  PaginationItemButtonProps
>(({ className, isActive, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    aria-current={isActive ? "page" : undefined}
    className={clsxInputs(
      "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "border-input bg-background hover:border-gray-300 hover:bg-accent",
      className
    )}
    {...props}
  />
))
PaginationItemButton.displayName = "PaginationItemButton"

export interface PaginationPrevButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PaginationPrevButton = React.forwardRef<
  HTMLButtonElement,
  PaginationPrevButtonProps
>(({ className, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    aria-label="Previous page"
    className={clsxInputs(
      "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:border-gray-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
      className
    )}
    {...props}
  >
    <ChevronLeft />
  </button>
))
PaginationPrevButton.displayName = "PaginationPrevButton"

export interface PaginationNextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PaginationNextButton = React.forwardRef<
  HTMLButtonElement,
  PaginationNextButtonProps
>(({ className, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    aria-label="Next page"
    className={clsxInputs(
      "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:border-gray-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
      className
    )}
    {...props}
  >
    <ChevronRight />
  </button>
))
PaginationNextButton.displayName = "PaginationNextButton"

export {
  PaginationItemButton,
  PaginationPrevButton,
  PaginationNextButton,
}
