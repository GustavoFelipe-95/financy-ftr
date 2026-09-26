export interface Category {
    id: string;
    title: string;
    icon: string;
    color: string;
    description?: string | null;
    transactions?: { id: string }[];
}

export interface CategoryQueryData {
    categories: Category[];
}

export interface CreateCategoryInput {
    title: string;
    description: string | null;
    icon: string;
    color: string;
}

export interface UpdateCategoryInput {
    title?: string;
    description?: string | null;
    icon?: string;
    color?: string;
}