"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import type { Product } from "@/features/products/types";

type Props = {
  product: Product | null;
  onSaved: (p: Product) => void;
  onClose: () => void;
};

export default function ProductModal({ product, onSaved, onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black";

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const body = {
      name: form.get("name"),
      description: form.get("description") || undefined,
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
    };

    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Something went wrong.");
      return;
    }

    const saved = await res.json();
    onSaved({ ...saved, price: saved.price.toString() });
  }

  return (
    <Modal title={product ? "Edit product" : "Add product"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            defaultValue={product?.name}
            className={inputClass}
          />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            name="description"
            defaultValue={product?.description ?? ""}
            className={`${inputClass}`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price" htmlFor="price">
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={product?.price}
              className={inputClass}
            />
          </Field>

          <Field label="Stock" htmlFor="stock">
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={product?.stock ?? 0}
              className={inputClass}
            />
          </Field>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 mt-1">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
