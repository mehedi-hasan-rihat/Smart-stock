"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/constants";
import type { Product } from "./types";

type Props = {
  products: Product[];
  onSold: (updated: Product[]) => void;
  onClose: () => void;
};

type Line = { product: Product; quantity: number };

export default function SellModal({ products, onSold, onClose }: Props) {
  const [saleItems, setSaleItems] = useState<Line[]>(
    products.map((p) => ({ product: p, quantity: 1 }))
  );
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  const total = saleItems.reduce(
    (sum, l) => sum + Number(l.product.price) * l.quantity,
    0
  );

  function setQuantity(id: string, qty: number) {
    setSaleItems((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, quantity: qty } : item
      )
    );
  }

  async function handleConfirm() {
    setError(null);

    // Frontend validation
    for (const item of saleItems) {
      if (!item.quantity || item.quantity < 1) {
        const msg = `Quantity for "${item.product.name}" must be at least 1.`;
        setError(msg);
        toastError(msg);
        return;
      }
      if (item.quantity > item.product.stock) {
        const msg = `Not enough stock for "${item.product.name}" (available: ${item.product.stock}).`;
        setError(msg);
        toastError(msg);
        return;
      }
    }

    setLoading(true);

    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: customerName || undefined,
        customerEmail: customerEmail || undefined,
        items: saleItems.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      const msg = typeof data.error === "string" ? data.error : "Failed to process sale.";
      setError(msg);
      toastError(msg);
      return;
    }

    const updated = saleItems.map((l) => ({
      ...l.product,
      stock: l.product.stock - l.quantity,
    }));
    success("Sale completed successfully.");
    onSold(updated);
  }

  return (
    <Modal title="Sell products" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="customerName"
            type="text"
            label="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <Input
            id="customerEmail"
            type="email"
            label="Customer email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
          {saleItems.map((l) => (
            <div key={l.product.id} className="flex items-center justify-between gap-2 py-1 border-b border-gray-100 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{l.product.name}</p>
                <p className="text-xs text-gray-500">
                  {formatPrice(l.product.price)} · {l.product.stock} in stock
                </p>
              </div>
              <div className="w-24 shrink-0">
                <Input
                  id={`qty-${l.product.id}`}
                  type="number"
                  label=""
                  value={l.quantity}
                  onChange={(e) => setQuantity(l.product.id, Number(e.target.value))}
                />
              </div>
              <div className="w-20 text-right shrink-0">
                <p className="text-sm font-medium">
                  {formatPrice(Number(l.product.price) * l.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm border-t border-gray-200 pt-4">
          <span className="font-medium">Total</span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 mt-1">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing…" : "Confirm sale"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
