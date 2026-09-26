import { Caption } from "@/components/designSystem/typography";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/categoryTypes";
import { CategoryIcon } from "../categoryIcon";
import { ArrowUpDown, Tag } from "lucide-react";
import { CATEGORY_COLOR_LIST } from "@/constants";

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
                <CardContent className="flex flex-col w-full gap-4 p-6">
                    <div className="text-gray-600 flex-row flex gap-2">
                        <Tag size={28} aria-hidden color={'#374151'} style={{ marginRight: '10px' }} />
                        <div className="flex flex-col mt-[-8px]">
                            <p style={{ fontSize: '32px' }} className="font-bold">{count}</p>
                            <Caption className="text-gray-500 text-sm uppercase">Total de categorias</Caption>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col w-full gap-4 p-6">
                    <div className="text-gray-600 flex-row flex gap-2">
                        <ArrowUpDown size={28} aria-hidden color={'#9333EA'} style={{ marginRight: '10px' }} />
                        <div className="flex flex-col mt-[-8px]">
                            <p style={{ fontSize: '32px' }} className="font-bold">{countTransactions}</p>
                            <Caption className="text-gray-500 text-sm uppercase">Total de transações</Caption>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col w-full gap-4 p-6">
                    <div className="text-gray-600 flex-row flex gap-2">
                        {mostTransactions?.icon && (
                            <CategoryIcon
                                iconName={mostTransactions.icon}
                                size={30}
                                style={{
                                    marginRight: '10px',
                                    color: CATEGORY_COLOR_LIST.find(color => color.value === mostTransactions.color)?.base
                                }} />
                        )}
                        <div className="flex flex-col mt-[-8px]">
                            <p style={{ fontSize: '32px' }} className="font-bold">{mostTransactions?.title ?? "N/A"}</p>
                            <Caption className="text-gray-500 text-sm uppercase">Categorias mais utilizada</Caption>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}