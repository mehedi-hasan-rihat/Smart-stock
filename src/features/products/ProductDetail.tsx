"use client";

import { useState } from "react";
import Link from "next/link";
import { RxArrowLeft } from "react-icons/rx";
import Button from "@/components/ui/Button";
import SellModal from "./SellModal";
import { LOW_STOCK_THRESHOLD, formatPrice } from "@/lib/constants";
import type { Product } from "./types";

type DetailProduct = Product & { createdAt: string; updatedAt: string };

const LOW_STOCK = LOW_STOCK_THRESHOLD;

export default function ProductDetail({ product: initial }: { product: DetailProduct }) {
  const [product, setProduct] = useState(initial);
  const [selling, setSelling] = useState(false);

  return (
    <div className="max-w-lg">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-6 transition-colors"
      >
        <RxArrowLeft size={14} /> Back to products
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <Button onClick={() => setSelling(true)}>Sell</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Price</dt>
          <dd className="text-sm font-medium">{formatPrice(product.price)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Stock</dt>
          <dd className="text-sm font-medium flex items-center gap-2">
            {product.stock} units
            {product.stock <= LOW_STOCK && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700">Low</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</dt>
          <dd className="text-sm font-medium">{new Date(product.createdAt).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last updated</dt>
          <dd className="text-sm font-medium">{new Date(product.updatedAt).toLocaleDateString()}</dd>
        </div>
      </div>

      <dl className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</dt>
          <dd className="text-sm">{product.description ?? "—"}</dd>
        </div>
      </dl>

      {selling && (
        <SellModal
          products={[product]}
          onSold={(updated) => {
            setProduct(updated[0] as DetailProduct);
            setSelling(false);
          }}
          onClose={() => setSelling(false)}
        />
      )}
    </div>
  );
}
