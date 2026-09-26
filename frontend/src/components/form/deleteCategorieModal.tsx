import type { Category } from "@/types";
import { Modal } from "../ui/modal";
import { CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export interface DeleteCategoryConfirmProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  category: Category | null;
  onConfirm: (category: Category) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
}

export function DeleteCategoryConfirm({
  visible,
  onVisibleChange,
  category,
  onConfirm,
  loading = false,
  errorMessage,
}: DeleteCategoryConfirmProps) {
    if (!category) return null;

    async function handleConfirm() {
      if(!category) return null;
        await onConfirm(category);
        onVisibleChange(false);
    }

    return (
        <Modal
          open={visible}
          onOpenChange={onVisibleChange}
          contentClassName="p-0">
            <CardHeader className="pb-2 space-y-1">
                <h2 className="text-xl font-semibold">Excluir Categoria</h2>
                <p className="text-sm text-muted-foreground">
                    Tem certeza que deseja excluir {`"${category.title}"`}? Esta ação não pode ser desfeita.
                </p>
            </CardHeader>
            <CardContent className="pt-0">
                {
                    errorMessage && (
                        <p className="mb-4 text-sm text-destructive">
                            {errorMessage}
                        </p>
                    )
                }
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onVisibleChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading}>
                        {loading ? "Excluindo..." : "Excluir"}
                    </Button>
                </div>
            </CardContent>
        </Modal>
    )
}