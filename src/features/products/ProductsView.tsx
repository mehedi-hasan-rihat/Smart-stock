"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import type { Product } from "./types";

export default function ProductsView({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setModalOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return;
    await fetch(`/api/products/${deleting.id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
    setDeleting(null);
  }

  function handleSaved(product: Product) {
    setProducts((prev) =>
      editing ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev]
    );
    setModalOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>Add product</Button>
      </div>

      <ProductTable products={products} onEdit={openEdit} onDelete={setDeleting} />

      {modalOpen && (
        <ProductModal product={editing} onSaved={handleSaved} onClose={() => setModalOpen(false)} />
      )}

      {deleting && (
        <DeleteConfirmModal
          product={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
