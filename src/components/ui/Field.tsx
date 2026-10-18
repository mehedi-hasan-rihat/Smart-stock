import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

export default function Field({ label, htmlFor, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
