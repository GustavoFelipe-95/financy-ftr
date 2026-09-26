

import { clsxInputs } from '@/lib/clsxInputs'

export interface TagPillProps {
  label: string,
  color: string,
  textColor?: string,
  className?: string
}

export const TagPill = ({ label, color, textColor, className }: TagPillProps) => {
  return (
    <span
        className={clsxInputs(
          'inline-flex items-center px-3 py-1 text-xs font-light rounded-full',
          className
        )}
        style={{ backgroundColor: color, color: textColor ?? 'white' }}>
      {label}
    </span>
  )
}