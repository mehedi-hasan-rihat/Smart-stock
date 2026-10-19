"use client";

import { formatPrice } from "@/lib/constants";
import type { Sale } from "./types";

function saleTotal(sale: Sale): number {
  return sale.items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SalesTable({ sales }: { sales: Sale[] }) {
  if (sales.length === 0) {
    return (
      <div className="border border-gray-300 rounded-md">
        <p className="text-center py-10 text-black text-lg font-semibold">No sales yet</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300/80 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300/80 bg-gray-50 font-medium">
            <th className="text-left px-5 py-3">Date</th>
            <th className="text-left px-5 py-3">Customer</th>
            <th className="text-left px-5 py-3">Items</th>
            <th className="text-right px-5 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} className="border-t border-gray-300/80 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                {formatDate(sale.createdAt)}
              </td>
              <td className="px-5 py-3.5">
                {sale.customerName ? (
                  <div>
                    <p className="font-medium">{sale.customerName}</p>
                    {sale.customerEmail && (
                      <p className="text-xs text-gray-500">{sale.customerEmail}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex flex-col gap-0.5">
                  {sale.items.slice(0, 3).map((item) => (
                    <span key={item.id} className="text-gray-700">
                      {item.productName}{" "}
                      <span className="text-gray-400">×{item.quantity}</span>
                    </span>
                  ))}
                  {sale.items.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{sale.items.length - 3} more…
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-3.5 text-right font-medium">
                {formatPrice(saleTotal(sale))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
