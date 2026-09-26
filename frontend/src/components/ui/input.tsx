import React, { useState } from "react";
import { clsxInputs } from "@/lib/clsxInputs";
import { Check } from "lucide-react";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  label?: string
  helperText?: string
  error?: boolean
  valid?: boolean
  containerClassName?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      error = false,
      valid = false,
      disabled = false,
      containerClassName,
      id: idProp,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {

    const [isFocused, setIsFocused] = useState(false)
    const id = React.useId()
    const inputId = idProp ?? id
    const hasStartIcon = Boolean(startIcon)
    const hasEndIcon = Boolean(endIcon)
    const hasValidIcon = valid && !error

    return (
      <div className={clsxInputs("space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={clsxInputs(
              "text-sm font-medium leading-none",
              error ? "text-destructive" : isFocused ? "text-brand-base" : "text-muted-foreground",
              disabled && "text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            disabled={disabled}
            className={clsxInputs(
              "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed md:text-sm",
              "border-input text-foreground focus-visible:ring-0 ",
              hasStartIcon && "pl-9",
              error && "placeholder:text-destructive/80",
              (hasEndIcon || hasValidIcon) && "pr-9",
              hasEndIcon && hasValidIcon && "pr-14",
              disabled &&
                "border-dashed bg-muted text-muted-foreground cursor-not-allowed opacity-70",
              className
            )}
            ref={ref}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...props}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {hasStartIcon && (
            <span
              className={clsxInputs(
                "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none [&_svg]:size-4",
                error ? "text-destructive" : isFocused ? "text-brand-base" : "text-muted-foreground"
              )}
            >
              {startIcon}
            </span>
          )}
          {(hasValidIcon || hasEndIcon) && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 [&_svg]:size-4">
              {hasValidIcon && (
                <span className="pointer-events-none text-[var(--feedback-success)] shrink-0" aria-hidden>
                  <Check className="size-4" />
                </span>
              )}
              {hasEndIcon && (
                <span className="text-muted-foreground flex items-center shrink-0">
                  {endIcon}
                </span>
              )}
            </span>
          )}
        </div>
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={clsxInputs(
              "text-[0.8rem] text-gray-500",
              disabled && "text-muted-foreground"
            )}
          >{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
