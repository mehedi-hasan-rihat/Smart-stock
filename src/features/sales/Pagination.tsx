"use client";

import Button from "@/components/ui/Button";

type Props = {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, total, limit, onChange }: Props) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm mt-4">
      <p className="text-gray-500">
        Page {page} of {totalPages} · {total} sales
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <Button variant="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
