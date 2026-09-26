import { useCategoriesMutations } from '@/hooks/useMutations';
import { useQueryCategories } from '@/hooks/useQueryCategories';
import { useState } from 'react';
import type { Category } from '@/types';
import { AuthLayout } from '@/components/custom/authLayout';
import { Button } from '@/components/ui/button';
import { Plus} from 'lucide-react';
import { H1, Body } from '@/components/designSystem/typography';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryCard } from '@/components/custom/category/categoryCard';
import { CategorySummary } from '@/components/custom/category/categorySummary';
import { DeleteCategoryConfirm } from '@/components/form/deleteCategorieModal';
import { CategoryFormModal, type CategoryFormValues } from '@/components/form/categoryModal';
import '@/index.css';

export function CategoriesScreen() {
  const { categories, loading: categoriesIsLoading, error, refetch } = useQueryCategories();
  const {
    create: createCategory,
    update: updateCategory,
    delete: deleteCategory,
    loading: categoriesMutationsIsLoading,
    error: categoriesMutationsError,
    statusCodeError: categoriesMutationsStatusCodeError,
  } = useCategoriesMutations(refetch);

  const [formVisible, setFormVisible] = useState(false);
  const [formDeletingVisible, setFormDeletingVisible] = useState(false);
  const [formType, setFormType] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  async function handleActionCategory(type: 'create' | 'edit' | 'delete', data?: Category) {
    if (type === 'create') {
      setFormVisible(true);
      setFormType('create');
      setEditingCategory(null);
    }
    else if (type === 'edit') {
      setFormVisible(true);
      setFormType('edit');
      setEditingCategory(data ?? null);
    }
    else if (type === 'delete') {
      setFormDeletingVisible(true);
      setDeletingCategory(data ?? null);
    }
  }

  async function handleFormSubmit(data: CategoryFormValues) {
    if (formType === 'create') {
      await createCategory({
        title: data?.title,
        description: data?.description || null,
        icon: data?.icon,
        color: data?.color
      });
    } else if (editingCategory &&formType === 'edit') {
      await updateCategory(editingCategory.id, {
        title: data?.title,
        description: data?.description || null,
        icon: data?.icon,
        color: data?.color
      });
    }
    setFormVisible(false);
    setEditingCategory(null);
  }

  async function handleDeleteConfirm(data: Category) {
    await deleteCategory(data.id);
    setFormDeletingVisible(false);
    setDeletingCategory(null);
  }

  const deleteErrorMessage = categoriesMutationsStatusCodeError === 'CATEGORY_HAS_TRANSACTIONS'
    ? categoriesMutationsError?.message ?? 'Esta categoria possui transações e não pode ser excluída.'
    : null;

  return (
    <AuthLayout>
      <div className='space-y-8'>
        <div className=' flex flex-col gap-4 sm:flex-row sm:items-center justify-between'>
          <div>
            <H1 className='text-xl font-semibold'>Categorias</H1>
            <Body className='text-muted-foreground mt-1'>
              Organize suas transações por categorias
            </Body>
          </div>
          <Button
            className='shrink-0 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-brand-dark'
            onClick={() => handleActionCategory('create')}>
            <Plus />
            Nova Categoria
          </Button>
        </div>

        {categoriesIsLoading && <Body>Carregando...</Body>}
        {error && <Body className='text-destructive'>{error.message ?? 'Ocorreu um erro'}</Body>}

        {!categoriesIsLoading && !error && (
          <>
            <CategorySummary categories={categories} />
            {
              categories.length === 0 ? (
                <Card>
                  <CardContent className='py-8'>
                    <Body className='text-muted-foreground text-center'>
                      Nenhuma categoria encontrada.
                    </Body>
                  </CardContent>
                </Card>
              ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  {categories.map((item: Category) => (
                    <CategoryCard
                      key={item.id}
                      category={item}
                      onEdit={() => handleActionCategory('edit', item)}
                      onDelete={() => handleActionCategory('delete', item)}
                    />
                  ))}
                </div>
              )
            }
          </>
        )}
      </div>

      <CategoryFormModal
        visible={formVisible}
        onVisibleChange={setFormVisible}
        mode={formType}
        category={formType === 'edit' ? editingCategory : null}
        onSubmit={handleFormSubmit}
        loading={categoriesMutationsIsLoading} />

      <DeleteCategoryConfirm
        visible={formDeletingVisible}
        onVisibleChange={(open: boolean) => {
          setFormDeletingVisible(open)
          if (!open) setDeletingCategory(null)
        }}
        category={deletingCategory}
        onConfirm={handleDeleteConfirm}
        loading={categoriesMutationsIsLoading}
        errorMessage={deleteErrorMessage} />
    </AuthLayout>
  )
}
