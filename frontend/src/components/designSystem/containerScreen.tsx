import * as React from 'react'
import { clsxInputs } from '@/lib/clsxInputs';

export interface ContainerScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthClass = { sm: 'max-w-screen-sm', md: 'max-w-screen-md', lg: 'max-w-screen-lg', xl: 'max-w-screen-xl', '2xl': 'max-w-screen-2xl', full: 'max-w-full' }

export function ContainerScreen({ maxWidth = 'xl', className, ...props }: ContainerScreenProps) {
  return (
    <div
      className={clsxInputs('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidthClass[maxWidth], className)}
      {...props}
    />
  )
}
