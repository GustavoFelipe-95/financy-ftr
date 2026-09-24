import type { Transaction } from "@/types";
import { Modal } from "../ui/modal";
import { CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export interface DeleteTransactionModalProps {
    visible: boolean;
    onVisibleChange: (visible: boolean) => void;
    transaction: Transaction | null;
    onConfirm: (transaction: Transaction) => Promise<void>;
    loading: boolean;
    errorMessage: string | null;
}

export function DeleteTransactionModal({
    visible,
    onVisibleChange,
    transaction,
    onConfirm,
    loading = false,
    errorMessage,
}: DeleteTransactionModalProps) {
    if (!transaction) return null;

    async function handleConfirm() {
        if (!transaction) return null;
        await onConfirm(transaction);
        onVisibleChange(false);
    }

    return (
        <Modal
            open={visible}
            onOpenChange={onVisibleChange}
            contentClassName="p-0">
            <div className="p-6">
                <CardHeader className="pb-2 space-y-1">
                    <h2 className="text-xl font-semibold">Excluir Transação</h2>
                    <p className="text-sm text-muted-foreground">
                        Tem certeza que deseja excluir {`"${transaction.description}"`}? Esta ação não pode ser desfeita.
                    </p>
                </CardHeader>
                <CardContent className="pt-0 px-0">
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
            </div>
        </Modal>
    );
}