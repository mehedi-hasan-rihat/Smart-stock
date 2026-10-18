import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black transition-shadow";

export default function Input({ label, id, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input id={id} className={inputClass} {...rest} />
    </div>
  );
}
