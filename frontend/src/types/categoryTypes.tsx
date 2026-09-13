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