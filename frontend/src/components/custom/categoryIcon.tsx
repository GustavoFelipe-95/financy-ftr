import {
  Briefcase,
  Car,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Box,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  Book,
  Plane,
  Mail,
  FileText,
  Folder,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Car,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Box,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  Book,
  Plane,
  Mail,
  FileText,
}

const defaultIcon = Folder

export function getCategoryIcon(iconName: string): LucideIcon {
  if (!iconName || typeof iconName !== 'string') return defaultIcon
  const key = iconName.trim()
  return iconMap[key] ?? defaultIcon
}

export function CategoryIcon({
  iconName,
  className,
  size = 24,
  style,
}: {
  iconName: string
  className?: string
  size?: number
  style?: React.CSSProperties
}) {
  const Icon = getCategoryIcon(iconName)
  return <Icon className={className} size={size} style={style} aria-hidden />
}
