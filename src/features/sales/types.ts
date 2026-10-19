export type SaleItem = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
};

export type Sale = {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
  items: SaleItem[];
};

export type SalesPage = {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
};
