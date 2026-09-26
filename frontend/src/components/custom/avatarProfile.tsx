import { clsxInputs } from '@/lib/clsxInputs';

function getInitials(name: string, email: string): string {
    const trimmed = name.trim()
    if (trimmed.length >= 2) {
        const parts = trimmed.split(/\s+/)
        if (parts.length >= 2) {
            const first = parts[0].charAt(0)
            const second = parts[1].charAt(0)
            return (first + second).toUpperCase()
        }
        return trimmed.slice(0, 2).toUpperCase()
    }
    if (email) {
        const local = email.split('@')[0] ?? ''
        return local.slice(0, 2).toUpperCase() || '??'
    }
    return '??'
}

interface AvatarProfileProps {
    name: string
    email: string
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl' }

export function AvatarProfile({ name, email, className, size = 'md' }: AvatarProfileProps) {
    const initials = getInitials(name, email)
    return (
        <span
            className={clsxInputs(
                'inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-foreground',
                sizeClasses[size],
                className
            )}
            aria-hidden>
            {initials}
        </span>
    )
}
