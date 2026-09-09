

import { clsxInputs } from '@/lib/clsxInputs'

export interface TagPillProps {
  label: string,
  color: string,
  className?: string
}

export const TagPill = ({ label, color, className }: TagPillProps) => {
  return (
    <span
        className={clsxInputs(
          'inline-flex items-center px-3 py-1 text-xs font-light text-white rounded-full',
          className
        )}
        style={{ backgroundColor: color }}>
      {label}
    </span>
  )
}