"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPreorder, updatePreorder } from "../lib/actions";

interface PreorderFormData {
  id?: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string; // ISO or YYYY-MM-DDTHH:MM
  endsAt: string; // ISO or YYYY-MM-DDTHH:MM or empty
  isActive: boolean;
}

interface PreorderFormProps {
  initialData?: PreorderFormData;
  isEdit?: boolean;
}

// Convert Date to YYYY-MM-DDTHH:MM format for datetime-local input
function formatForInput(dateVal: string | Date | null | undefined): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function PreorderForm({ initialData, isEdit = false }: PreorderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    products: initialData?.products ?? 1,
    preorderWhen: initialData?.preorderWhen || "regardless-of-stock",
    startsAt: initialData?.startsAt ? formatForInput(initialData.startsAt) : formatForInput(new Date()),
    endsAt: formatForInput(initialData?.endsAt),
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError(null);

    const submissionData = {
      name: formData.name,
      products: formData.products,
      preorderWhen: formData.preorderWhen,
      startsAt: formData.startsAt ? new Date(formData.startsAt) : new Date(),
      endsAt: formData.endsAt ? new Date(formData.endsAt) : null,
      isActive: formData.isActive,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updatePreorder(initialData.id, submissionData);
    } else {
      res = await createPreorder(submissionData);
    }

    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setLoading(false);
      setError(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 bg-[#F1F1F1] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-700 transition-colors shadow-xs"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-700 transition-colors shadow-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer flex items-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Save changes
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
          
          {/* Card Header */}
          <div className="p-6 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-900">Preorder details</h2>
            <p className="text-xs text-zinc-500 mt-1">
              These values appear in the preorders list.
            </p>
          </div>

          {/* Form Fields container */}
          <div className="divide-y divide-zinc-100">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Field 1: Name */}
            <div className="py-4 mx-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <label htmlFor="name" className="text-xs font-bold text-zinc-900 flex items-center">
                  Name<span className="text-red-500 ml-0.5">*</span>
                </label>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                  A label to recognize this preorder by.
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Multi variant 3"
                  className="w-full max-w-md px-3.5 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 text-zinc-800"
                />
              </div>
            </div>

            {/* Field 2: Products */}
            <div className="py-4 mx-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <label htmlFor="products" className="text-xs font-bold text-zinc-900">
                  Products
                </label>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                  Number of products covered by this preorder.
                </p>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="number"
                  id="products"
                  name="products"
                  min="0"
                  value={formData.products}
                  onChange={handleChange}
                  className="w-24 px-3.5 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 text-zinc-800"
                />
                <span className="text-xs text-zinc-500 font-medium">product(s)</span>
              </div>
            </div>

            {/* Field 3: Preorder when */}
            <div className="py-4 mx-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <label htmlFor="preorderWhen" className="text-xs font-bold text-zinc-900">
                  Preorder when
                </label>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                  When customers are allowed to preorder.
                </p>
              </div>
              <div className="md:col-span-2">
                <select
                  id="preorderWhen"
                  name="preorderWhen"
                  value={formData.preorderWhen}
                  onChange={handleChange}
                  className="w-full max-w-md px-3.5 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 bg-white text-zinc-800"
                >
                  <option value="regardless-of-stock">regardless-of-stock</option>
                  <option value="out-of-stock">out-of-stock</option>
                </select>
              </div>
            </div>

            {/* Field 4: Starts at */}
            <div className="py-4 mx-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <label htmlFor="startsAt" className="text-xs font-bold text-zinc-900">
                  Starts at
                </label>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                  When the preorder window opens.
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="datetime-local"
                  id="startsAt"
                  name="startsAt"
                  value={formData.startsAt}
                  onChange={handleChange}
                  className="w-full max-w-md px-3.5 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 text-zinc-800"
                />
              </div>
            </div>

            {/* Field 5: Ends at */}
            <div className="py-4 mx-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <label htmlFor="endsAt" className="text-xs font-bold text-zinc-900">
                  Ends at
                </label>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                  Leave empty for no end date.
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="datetime-local"
                  id="endsAt"
                  name="endsAt"
                  value={formData.endsAt}
                  onChange={handleChange}
                  className="w-full max-w-md px-3.5 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 text-zinc-800"
                />
              </div>
            </div>

            {/* Field 6: Status */}
            <div className="py-4 mx-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1">
                <span className="text-xs font-bold text-zinc-900">Status</span>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                  Active preorders are visible to customers.
                </p>
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleActive}
                  className={`w-10 h-6 rounded-[8px] m-[4px] transition-colors duration-200 ease-in-out cursor-pointer relative flex items-center ${
                    formData.isActive ? "bg-black" : "bg-zinc-200"
                  }`}
                  aria-label={`Toggle active state, current: ${
                    formData.isActive ? "Active" : "Inactive"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-[4px] bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                      formData.isActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-xs text-zinc-600 font-semibold select-none">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="py-4 mx-5 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-end gap-2">
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-black transition-colors rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer flex items-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Save changes
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}
