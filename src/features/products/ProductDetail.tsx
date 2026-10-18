import Link from "next/link";
import { RxArrowLeft } from "react-icons/rx";
import type { Product } from "./types";

type DetailProduct = Product & { createdAt: string; updatedAt: string };

export default function ProductDetail({ product }: { product: DetailProduct }) {
  return (
    <div className="max-w-lg">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-6 transition-colors"
      >
        <RxArrowLeft size={14} /> Back to products
      </Link>

      <h1 className="text-xl font-semibold mb-6">{product.name}</h1>

      <dl className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</dt>
          <dd className="text-sm">{product.description ?? "—"}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</dt>
          <dd className="text-sm">${Number(product.price).toFixed(2)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</dt>
          <dd className="text-sm">{product.stock} units</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</dt>
          <dd className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last updated</dt>
          <dd className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</dd>
        </div>
      </dl>
    </div>
  );
}
