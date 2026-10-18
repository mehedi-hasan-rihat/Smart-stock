"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import SellModal from "./SellModal";
import type { Product } from "./types";

export default function ProductsView({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [sellOpen, setSellOpen] = useState(false);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

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
    const res = await fetch(`/api/products/${deleting.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
    setDeleting(null);
  }

  function handleSaved(product: Product) {
    setProducts((prev) =>
      editing ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev]
    );
    setModalOpen(false);
  }

  function handleSold(updated: Product[]) {
    setProducts((prev) =>
      prev.map((p) => updated.find((u) => u.id === p.id) ?? p)
    );
    setSelected([]);
    setSellOpen(false);
  }

  const selectedProducts = products.filter((p) => selected.includes(p.id));

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          {selected.length > 0 ? `${selected.length} selected` : ""}
        </p>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <Button onClick={() => setSellOpen(true)}>Sell selected</Button>
          )}
          <Button onClick={openCreate}>Add product</Button>
        </div>
      </div>

      <ProductTable
        products={products}
        selected={selected}
        onToggle={toggle}
        onEdit={openEdit}
        onDelete={setDeleting}
      />

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

      {sellOpen && selectedProducts.length > 0 && (
        <SellModal
          products={selectedProducts}
          onSold={handleSold}
          onClose={() => setSellOpen(false)}
        />
      )}
    </>
  );
}
