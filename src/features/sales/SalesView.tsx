"use client";

import { useState, useCallback } from "react";
import SalesTable from "./SalesTable";
import Pagination from "./Pagination";
import { useToast } from "@/components/ui/Toast";
import type { Sale, SalesPage } from "./types";

const LIMIT = 20;

export default function SalesView({ initial }: { initial: SalesPage }) {
  const [sales, setSales]   = useState<Sale[]>(initial.sales);
  const [total, setTotal]   = useState(initial.total);
  const [page, setPage]     = useState(initial.page);
  const [loading, setLoading] = useState(false);
  const { error } = useToast();

  const fetchPage = useCallback(async (nextPage: number) => {
    setLoading(true);
    const res = await fetch(`/api/sales?page=${nextPage}&limit=${LIMIT}`);
    setLoading(false);

    if (!res.ok) {
      error("Failed to load sales.");
      return;
    }

    const data: SalesPage = await res.json();
    setSales(data.sales);
    setTotal(data.total);
    setPage(data.page);
  }, [error]);

  return (
    <>
      <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : ""}>
        <SalesTable sales={sales} />
      </div>
      <Pagination page={page} total={total} limit={LIMIT} onChange={fetchPage} />
    </>
  );
}
