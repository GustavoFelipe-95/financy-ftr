import * as React from 'react';
import { useState } from 'react';
import { clsxInputs } from "@/lib/clsxInputs";

export interface TextareaProps
  extends Omit<React.ComponentProps<'textarea'>, 'size'> {
  label?: string
  helperText?: string
  error?: boolean
  containerClassName?: string
  id?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error = false,
      disabled = false,
      containerClassName,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const id = React.useId()
    const textareaId = idProp ?? id

    return (
      <div className={clsxInputs('space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={clsxInputs(
              'text-sm font-medium leading-none',
              error
                ? 'text-destructive'
                : isFocused
                  ? 'text-brand-base'
                  : 'text-muted-foreground',
              disabled && 'text-muted-foreground'
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          disabled={disabled}
          ref={ref}
          className={clsxInputs(
            'flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed md:text-sm',
            'border-input text-foreground focus-visible:ring-0',
            error && 'placeholder:text-destructive/80',
            disabled &&
              'border-dashed bg-muted text-muted-foreground cursor-not-allowed opacity-70',
            className
          )}
          aria-invalid={error}
          aria-describedby={helperText ? `${textareaId}-helper` : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {helperText && (
          <p
            id={`${textareaId}-helper`}
            className={clsxInputs(
              'text-[0.8rem]',
              error ? 'text-destructive' : 'text-muted-foreground',
              disabled && 'text-muted-foreground'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
