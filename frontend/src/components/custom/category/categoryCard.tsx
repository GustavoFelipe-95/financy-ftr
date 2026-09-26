import { Card, CardContent } from "@/components/ui/card";
import { CategoryIcon } from "../categoryIcon";
import { IconButton } from "@/components/ui/icon-button";
import { Body, Caption } from "@/components/designSystem/typography";
import { TagPill } from "../tagPill";
import type { Category } from "@/types/categoryTypes";
import { SquarePen, Trash2 } from "lucide-react";
import { CATEGORY_COLOR_LIST } from "@/constants";

export interface CategoryCardProps {
    category: Category;
    onEdit?: (category: Category) => void;
    onDelete?: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    const count = category?.transactions?.length ?? 0;
    const concatLabel = count === 1 ? 'item' : 'itens';
    const categoryPallet = CATEGORY_COLOR_LIST.find(item => item.value === category.color);

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2">
                    <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: categoryPallet?.value ?? category.color }}>
                        <CategoryIcon iconName={category.icon} size={20} style={{ color: categoryPallet?.base ?? 'black' }} />
                    </div>
                    <div className="flex shrink-0 gap-1">
                        <IconButton
                            size="sm"
                            aria-label="Deletar categoria"
                            className="text-destructive"
                            onClick={() => onDelete?.(category)}>
                            <Trash2 className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                            size="sm"
                            aria-label="Editar categoria"
                            onClick={() => onEdit?.(category)}>
                            <SquarePen className="h-4 w-4" />
                        </IconButton>
                    </div>
                </div>
                <Body className="mt-4 font-semibold">{category.title}</Body>
                <div className="h-12">
                    {category.description && (
                        <Caption className="text-muted-foreground text-sm text-light mt-1 block">
                            {category.description}
                        </Caption>
                    )}
                </div>
                <div className="flex items-center justify-between flex-wrap">
                    <TagPill
                        label={category.title}
                        color={categoryPallet?.value ?? category.color}
                        className="font-semibold"
                        textColor={categoryPallet?.base ?? 'white'} />
                    <Caption className="text-muted-foreground text-sm text-light">
                        {count} {concatLabel}
                    </Caption>
                </div>
            </CardContent>
        </Card>
    )
}