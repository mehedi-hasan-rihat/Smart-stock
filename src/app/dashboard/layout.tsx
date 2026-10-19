"use client";

import { useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/sales", label: "Sales" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-300 flex items-center justify-between">
        <span className="font-semibold text-sm">SmartStock</span>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-black md:hidden">
            <RxCross2 size={16} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-300">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-gray-300 shrink-0">
        <Sidebar />
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-white border-r border-gray-300 flex flex-col transform transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-300 shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-700 hover:text-black"
            aria-label="Open menu"
          >
            <RxHamburgerMenu size={20} />
          </button>
          <span className="font-semibold text-sm">SmartStock</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
