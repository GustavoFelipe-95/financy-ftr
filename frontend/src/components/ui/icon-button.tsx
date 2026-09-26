import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { clsxInputs } from "@/lib/clsxInputs"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:border-gray-400 hover:text-foreground",
  {
    variants: {
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof iconButtonVariants> {
  children: React.ReactNode
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={clsxInputs(iconButtonVariants({ size, className }))}
        {...props}
      />
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }
