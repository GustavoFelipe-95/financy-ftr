import { useEffect } from "react";
import type { Category } from "@/types";
import { clsxInputs } from "@/lib/clsxInputs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categorySchema } from "@/validations/categoriesValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORY_ICON_LIST, CATEGORY_COLOR_LIST } from "@/constants";
import { Modal } from "../ui/modal";
import { IconButton } from "../ui/icon-button";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { getCategoryIcon } from "../custom/categoryIcon";

export type CategoryFormValues = z.infer<typeof categorySchema>;

export interface CategoryFormModalProps {
    visible: boolean;
    onVisibleChange: (visible: boolean) => void;
    mode: 'create' | 'edit';
    category?: Category | null;
    onSubmit: (data: CategoryFormValues) => Promise<void>;
    loading?: boolean;
}

export function CategoryFormModal({
    visible,
    onVisibleChange,
    mode,
    category,
    onSubmit,
    loading = false,
}: CategoryFormModalProps) {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            title: '',
            description: '',
            icon: CATEGORY_ICON_LIST[0].value,
            color: CATEGORY_COLOR_LIST[0].base
        }
    });

    const selectedIcon = form.watch('icon');
    const selectedColor = form.watch('color');

    useEffect(() => {
        if (!visible) return;
        if (category && mode === 'edit') {
            form.reset({
                title: category.title,
                description: category.description ?? '',
                icon: category.icon,
                color: category.color
            });
        } else if (mode === 'create') {
            form.reset({
                title: '',
                description: '',
                icon: CATEGORY_ICON_LIST[0].value,
                color: CATEGORY_COLOR_LIST[0].base
            });
        }
    }, [category?.id, form, visible, mode]);

    async function handleFormSubmit(data: CategoryFormValues) {
        await onSubmit(data);
        onVisibleChange(false);
    }

    return (
        <Modal
            open={visible}
            onOpenChange={onVisibleChange}
            contentClassName="p-0">
            <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {mode === 'create' ? 'Nova categoria' : 'Editar categoria'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {
                                mode === 'create'
                                    ? 'Organize suas transações com categorias.'
                                    : 'Altere os dados da categoria.'
                            }
                        </p>
                    </div>
                    <IconButton
                        size="sm"
                        className="shrink-0 rounded-md"
                        aria-label="Fechar"
                        onClick={() => onVisibleChange(false)}>
                        <X className="h-4 w-4" />
                    </IconButton>
                </div>

                <form
                    className="flex flex-col gap-4 mt-6"
                    onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <Input
                        label="Título"
                        placeholder="Ex: Alimentação"
                        error={!!form.formState.errors.title}
                        {...form.register('title')} />
                    {form.formState.errors.title && (
                        <p className="text-sm text-destructive -mt-2">
                            {form.formState.errors.title.message}
                        </p>
                    )}

                    <Textarea
                        label="Descrição"
                        placeholder="Ex: Gastos com alimentação"
                        helperText="Opcional"
                        error={!!form.formState.errors.description}
                        {...form.register('description')} />
                    {form.formState.errors.description && (
                        <p className="text-sm text-destructive -mt-2">
                            {form.formState.errors.description.message}
                        </p>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-muted-foreground">
                            Ícone
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {CATEGORY_ICON_LIST.map((option) => {
                                const Icon = getCategoryIcon(option.value)
                                const isSelected = selectedIcon === option.value
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => form.setValue('icon', option.value)}
                                        className={clsxInputs(
                                            'flex h-10 w-10 items-center justify-center rounded-md border transition-colors',
                                            isSelected
                                                ? 'border-primary bg-green-100 text-primary ring-2 ring-primary'
                                                : 'border-input bg-background text-gray-500 hover:border-gray-400 hover:text-foreground'
                                        )}
                                        aria-pressed={isSelected}
                                        aria-label={option.label}
                                    >
                                        <Icon className="h-5 w-5" aria-hidden />
                                    </button>
                                )
                            })}
                        </div>
                        {form.formState.errors.icon && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.icon.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-muted-foreground">
                            Cor
                        </label>
                        <div className="flex justify-between mb-4">
                            {CATEGORY_COLOR_LIST.map((option) => {
                                const isSelected = selectedColor === option.value
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => form.setValue('color', option.value)}
                                        className={clsxInputs(
                                            'h-5 w-10 border-1 rounded-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                            isSelected
                                                ? 'border-primary ring-2 ring-primary ring-offset-2'
                                                : 'border-gray-200 ring-1 ring-offset-2 hover:opacity-80'
                                        )}
                                        style={{ backgroundColor: `${option.base}` }}
                                        aria-pressed={isSelected}
                                        aria-label={option.label}
                                    />
                                )
                            })}
                        </div>
                        {form.formState.errors.color && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.color.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full rounded-lg">
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}