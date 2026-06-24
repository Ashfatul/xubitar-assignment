"use client";

import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  ariaLabel?: string;
}

export default function Checkbox({
  checked,
  onChange,
  className = "",
  ariaLabel,
}: CheckboxProps) {
  return (
    <label
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <span
        className={`w-4 h-4 rounded-[5px] border transition-colors flex items-center justify-center ${
          checked
            ? "bg-black border-black"
            : "bg-white border-zinc-300 peer-hover:border-zinc-400"
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
    </label>
  );
}
