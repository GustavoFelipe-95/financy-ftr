import * as React from 'react'
import { clsxInputs } from '@/lib/clsxInputs';

const typographyVariants = {
  h1: 'scroll-m-20 text-4xl font-bold tracking-tight',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  body: 'text-base leading-7',
  bodySm: 'text-sm leading-6',
  caption: 'text-xs text-muted-foreground',
  muted: 'text-muted-foreground',
}

type AllowedElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: keyof typeof typographyVariants
  as?: AllowedElement
}

export function Typography({ variant = 'body', as, className, ...props }: TypographyProps) {
  const defaultTag: AllowedElement =
    variant === 'body' || variant === 'bodySm' || variant === 'caption' || variant === 'muted' ? 'p' : (variant as AllowedElement)
  const tag = as ?? defaultTag
  const combinedClassName = clsxInputs(typographyVariants[variant], className)
  if (tag === 'h1') return <h1 className={combinedClassName} {...(props as React.HTMLAttributes<HTMLHeadingElement>)} />
  if (tag === 'h2') return <h2 className={combinedClassName} {...(props as React.HTMLAttributes<HTMLHeadingElement>)} />
  if (tag === 'h3') return <h3 className={combinedClassName} {...(props as React.HTMLAttributes<HTMLHeadingElement>)} />
  if (tag === 'h4') return <h4 className={combinedClassName} {...(props as React.HTMLAttributes<HTMLHeadingElement>)} />
  if (tag === 'span') return <span className={combinedClassName} {...(props as React.HTMLAttributes<HTMLSpanElement>)} />
  if (tag === 'div') return <div className={combinedClassName} {...(props as React.HTMLAttributes<HTMLDivElement>)} />
  return <p className={combinedClassName} {...(props as React.HTMLAttributes<HTMLParagraphElement>)} />
}

export function H1(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={typographyVariants.h1} {...props} />
}

export function H2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={typographyVariants.h2} {...props} />
}

export function H3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={typographyVariants.h3} {...props} />
}

export function H4(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={typographyVariants.h4} {...props} />
}

export function Body(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={typographyVariants.body} {...props} />
}

export function Caption(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={typographyVariants.caption} {...props} />
}
