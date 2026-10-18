"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { BsCheckCircleFill, BsXCircleFill, BsInfoCircleFill, BsX } from "react-icons/bs";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const STYLES: Record<ToastVariant, string> = {
  success: "bg-green-600 text-white",
  error:   "bg-red-600 text-white",
  info:    "bg-gray-800 text-white",
};

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <BsCheckCircleFill className="w-4 h-4 shrink-0" />,
  error:   <BsXCircleFill    className="w-4 h-4 shrink-0" />,
  info:    <BsInfoCircleFill  className="w-4 h-4 shrink-0" />,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm max-w-sm w-full pointer-events-auto ${STYLES[toast.variant]}`}
    >
      {ICONS[toast.variant]}
      <p className="flex-1 leading-snug">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} aria-label="Dismiss" className="opacity-70 hover:opacity-100 cursor-pointer">
        <BsX className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, message, variant }]);
  }, []);

  const success = useCallback((message: string) => toast(message, "success"), [toast]);
  const error   = useCallback((message: string) => toast(message, "error"),   [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div className="fixed bottom-5 right-5 z-9999 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
