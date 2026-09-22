import { Caption } from "@/components/designSystem/typography";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/categoryTypes";
import { CategoryIcon } from "../categoryIcon";
import { ArrowUpDown, Tag } from "lucide-react";

export interface CategorySummaryProps {
    categories: Category[];
}

export function CategorySummary({ categories }: CategorySummaryProps) {
    const count = categories.length;
    const countTransactions = categories.reduce((acc, category) => acc + (category.transactions?.length ?? 0), 0);
    const mostTransactions = categories.length === 0
        ? null
        : [...categories].sort((a, b) => (b.transactions?.length ?? 0) - (a.transactions?.length ?? 0))[0];

    return (
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardContent className="flex items-center flex-row gap-4 p-6">
                    <div className="text-gray-600">
                        <Tag className="h-6 w-6" aria-hidden />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{count}</p>
                        <Caption className="text-uppercase">Total de categorias</Caption>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center flex-row gap-4 p-6">
                    <div className="text-gray-600">
                        <ArrowUpDown className="h-6 w-6" aria-hidden />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{countTransactions}</p>
                        <Caption className="text-uppercase">Total de transações</Caption>
                    </div>                    
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center flex-row gap-4 p-6">
                    <div className="text-gray-600">
                        {mostTransactions?.icon && (
                            <CategoryIcon iconName={mostTransactions.icon} size={24} />
                        )}
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{mostTransactions?.title ?? "N/A"}</p>
                        <Caption className="text-uppercase">Categorias mais utilizada</Caption>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}