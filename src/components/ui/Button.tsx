import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-black text-white hover:bg-gray-800 disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
  ghost:
    "border border-gray-300 hover:bg-gray-50",
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
      className={`px-4 py-2 text-sm rounded-md transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
