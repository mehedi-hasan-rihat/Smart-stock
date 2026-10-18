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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Price</dt>
          <dd className="text-sm font-medium">${Number(product.price).toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Stock</dt>
          <dd className="text-sm font-medium">{product.stock} units</dd>
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
    </div>
  );
}
