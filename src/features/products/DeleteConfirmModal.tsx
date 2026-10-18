"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Product } from "@/features/products/types";

type Props = {
  product: Product;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteConfirmModal({ product, onConfirm, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    onConfirm();
    setLoading(false);
  }

  return (
    <Modal title="Delete product" onClose={onClose}>
      <p className="text-sm mb-6">
        Are you sure you want to delete
        <span className="font-medium text-black">{product.name}</span>? This cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={loading}>
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
