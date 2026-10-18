import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-black text-white hover:bg-gray-800 disabled:opacity-50 active:scale-95",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 active:scale-95",
  ghost:
    "border border-gray-300 hover:bg-gray-50 active:scale-95",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 text-sm rounded-md font-medium transition-all cursor-pointer ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
