import * as React from 'react'
import { createPortal } from 'react-dom'
import { clsxInputs } from '@/lib/clsxInputs'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  /** Optional class for the overlay */
  overlayClassName?: string
  /** Optional class for the content wrapper (centered panel) */
  contentClassName?: string
}

export function Modal({
  open,
  onOpenChange,
  children,
  overlayClassName,
  contentClassName,
}: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onOpenChange(false)
  }

  React.useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <div
      className={clsxInputs(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={clsxInputs(
          'relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border bg-background shadow-lg',
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
