"use client";

import Link from "next/link";
import { LOW_STOCK_THRESHOLD, formatPrice } from "@/lib/constants";
import type { Product } from "./types";

type Props = {
  products: Product[];
  selected: string[];
  onToggle: (id: string) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

const LOW_STOCK = LOW_STOCK_THRESHOLD;

export default function ProductTable({ products, selected, onToggle, onEdit, onDelete }: Props) {
  if (products.length === 0) {
    return (
      <div className="border border-gray-300 rounded-md">
        <p className="text-center py-10 text-black text-lg font-semibold">No products yet</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300/80 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300/80 bg-gray-50 font-medium">
            <th className="px-4 py-3 w-10" />
            <th className="text-left px-5 py-3">Title</th>
            <th className="text-right px-5 py-3">Price</th>
            <th className="text-right px-5 py-3">Stock</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-gray-300/80 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => onToggle(p.id)}
                  disabled={p.stock === 0}
                  className="cursor-pointer"
                />
              </td>
              <td className="px-5 py-3.5">
                <Link href={`/dashboard/products/${p.id}`} className="font-medium hover:underline">
                  {p.name}
                </Link>
              </td>
              <td className="px-5 py-3.5 text-right">{formatPrice(p.price)}</td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span>{p.stock}</span>
                  {p.stock <= LOW_STOCK && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                      Low
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-2.5 py-1 rounded text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="px-2.5 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
