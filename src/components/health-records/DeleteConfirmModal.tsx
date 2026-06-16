"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/components/common/useLanguage";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmModalProps) {
  const { t } = useLanguage();
  const hr = t.healthRecords;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>

            <DialogTitle className="text-base font-semibold text-gray-900">
              {hr.deleteModal.delete} {itemType ?? hr.record}
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm text-gray-500 pl-[52px]">
            {hr.deleteModal.confirmPrefix}{" "}
            <span className="font-semibold text-gray-700">
              &quot;{itemName}&quot;
            </span>
            {hr.deleteModal.confirmSuffix} {hr.deleteModal.cannotBeUndone}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl"
          >
            {hr.deleteModal.cancel}
          </Button>

          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            {hr.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}