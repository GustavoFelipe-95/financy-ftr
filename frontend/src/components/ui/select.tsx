import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { clsxInputs } from "@/lib/clsxInputs"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean
  }
>(({ className, error, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={clsxInputs(
      "flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-70 [&>span]:line-clamp-1",
      error
        ? "border-destructive focus:ring-destructive"
        : "border-input focus:ring-primary",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={clsxInputs(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={clsxInputs(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={clsxInputs(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-primary" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export interface SelectFieldOption {
  value: string
  label: string
}

export interface SelectFieldProps {
  label?: string
  helperText?: string
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  options: SelectFieldOption[]
  disabled?: boolean
  error?: boolean
  containerClassName?: string
  id?: string
}

function SelectField({
  label,
  helperText,
  placeholder = "Select...",
  value,
  onValueChange,
  options,
  disabled,
  error = false,
  containerClassName,
  id: idProp,
}: SelectFieldProps) {
  const id = React.useId()
  const fieldId = idProp ?? id

  return (
    <div className={clsxInputs("space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={clsxInputs(
            "text-sm font-medium leading-none",
            error ? "text-destructive" : "text-foreground",
            disabled && "text-muted-foreground"
          )}
        >
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={fieldId} error={error} aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {helperText && (
        <p
          id={`${fieldId}-helper`}
          className={clsxInputs(
            "text-[0.8rem]",
            error ? "text-destructive" : "text-foreground",
            disabled && "text-muted-foreground"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

SelectField.displayName = "SelectField"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectField,
}
