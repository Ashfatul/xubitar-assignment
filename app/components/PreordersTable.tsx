"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { deletePreorder, togglePreorderStatus } from "../lib/actions";

interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: Date | string;
  endsAt: Date | string | null;
  isActive: boolean;
  createdAt: Date | string;
}

interface PreordersTableProps {
  initialPreorders: Preorder[];
  totalCount: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  currentFilter: string;
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
}

function formatDate(dateVal: Date | null | string) {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour should be 12
  const hoursStr = String(hours).padStart(2, "0");
  return `${month} ${day}, ${year} ${hoursStr}:${minutes} ${ampm}`;
}

export default function PreordersTable({
  initialPreorders,
  totalCount,
  currentPage,
  limit,
  totalPages,
  currentFilter,
  currentSortBy,
  currentSortOrder,
}: PreordersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Local state for optimistic status changes or interactive states
  const [preorders, setPreorders] = useState<Preorder[]>(initialPreorders);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Sync state with server-side props when they change
  useEffect(() => {
    setPreorders(initialPreorders);
    setSelectedIds([]);
  }, [initialPreorders]);

  // Click outside sort dropdown to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update query params in URL
  const updateQuery = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (filter: "all" | "active" | "inactive") => {
    updateQuery({ filter, page: 1 });
  };

  const handleSortChange = (sortBy: string) => {
    updateQuery({ sortBy, page: 1 });
  };

  const handleDirectionChange = (sortOrder: "asc" | "desc") => {
    updateQuery({ sortOrder, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateQuery({ page: newPage });
    }
  };

  // Checkbox functions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(preorders.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const isAllSelected =
    preorders.length > 0 && selectedIds.length === preorders.length;

  // Toggle status Action
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setPreorders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p))
    );

    const res = await togglePreorderStatus(id, newStatus);
    if (res.success) {
      showToast(
        `Preorder status updated to ${newStatus ? "Active" : "Inactive"}.`,
        "success"
      );
    } else {
      // Revert if error
      setPreorders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: currentStatus } : p))
      );
      showToast("Failed to update status. Please try again.", "error");
    }
  };

  // Delete Action
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete preorder "${name}"?`)) {
      const res = await deletePreorder(id);
      if (res.success) {
        showToast(`Preorder "${name}" deleted successfully.`, "success");
        // Remove from local state
        setPreorders((prev) => prev.filter((p) => p.id !== id));
        setSelectedIds((prev) => prev.filter((rowId) => rowId !== id));
      } else {
        showToast("Failed to delete preorder. Please try again.", "error");
      }
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Pagination details
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  return (
    <div className="relative">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-md text-white transition-all transform duration-300 font-medium text-sm flex items-center gap-2 ${
            notification.type === "success" ? "bg-zinc-900 border border-zinc-800" : "bg-red-600"
          }`}
        >
          {notification.type === "success" ? (
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {notification.message}
        </div>
      )}

      {/* Main card wrapper */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-visible">
        {/* Card header toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 relative">
          {/* Tabs Filter */}
          <div className="flex rounded-lg p-0.5">
            {(["all", "active", "inactive"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize ${
                  currentFilter === tab
                    ? "text-black shadow-xs bg-[#EBEBEB]"
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="p-2 border border-zinc-200 hover:border-zinc-400 rounded-lg transition-colors cursor-pointer text-zinc-600 bg-white"
              aria-label="Sort options"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg z-30 p-2 text-sm text-zinc-800">
                <div className="px-2.5 py-1.5 text-xs font-semibold text-zinc-400 tracking-wider">
                  Sort by
                </div>
                <div className="space-y-0.5 mt-1">
                  {[
                    { key: "name", label: "Name" },
                    { key: "createdAt", label: "Created At" },
                    { key: "startsAt", label: "Starts At" },
                    { key: "endsAt", label: "Ends At" },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-zinc-50 rounded-md cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        checked={currentSortBy === option.key}
                        onChange={() => handleSortChange(option.key)}
                        className="w-3.5 h-3.5 border border-zinc-300 checked:bg-black checked:border-black accent-black cursor-pointer"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className="h-px bg-zinc-100 my-2"></div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleDirectionChange("asc")}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                      currentSortOrder === "asc"
                        ? "bg-zinc-100 text-black"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                      Ascending
                    </span>
                  </button>
                  <button
                    onClick={() => handleDirectionChange("desc")}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                      currentSortOrder === "desc"
                        ? "bg-zinc-100 text-black"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                      Descending
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-50/50">
                <th className="p-1 w-12 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 border border-zinc-300 rounded cursor-pointer checked:bg-black checked:border-black accent-black"
                  />
                </th>
                <th className="p-1 font-semibold text-zinc-500">Name</th>
                <th className="p-1 font-semibold text-zinc-500">Products</th>
                <th className="p-1 font-semibold text-zinc-500">Preorder when</th>
                <th className="p-1 font-semibold text-zinc-500">Starts at</th>
                <th className="p-1 font-semibold text-zinc-500">Ends at</th>
                <th className="p-1 font-semibold text-zinc-500">Status</th>
                <th className="p-1 font-semibold text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {preorders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-400 text-sm">
                    No preorders found matching current filters.
                  </td>
                </tr>
              ) : (
                preorders.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors text-xs text-zinc-700"
                  >
                    <td className="p-1 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={(e) =>
                          handleSelectRow(row.id, e.target.checked)
                        }
                        className="w-4 h-4 border border-zinc-300 rounded cursor-pointer checked:bg-black checked:border-black accent-black"
                      />
                    </td>
                    <td className="p-1 font-bold text-black">{row.name}</td>
                    <td className="p-1">{row.products}</td>
                    <td className="p-1">{row.preorderWhen}</td>
                    <td className="p-1">{formatDate(row.startsAt)}</td>
                    <td className="p-1">
                      {row.endsAt ? formatDate(row.endsAt) : ""}
                    </td>
                    <td className="p-1">
                      {/* Custom Toggle Switch */}
                      <button
                        onClick={() =>
                          handleToggleStatus(row.id, row.isActive)
                        }
                        className={`w-10 h-6 rounded-[8px] m-[4px] transition-colors duration-200 ease-in-out cursor-pointer relative flex items-center ${
                          row.isActive ? "bg-black" : "bg-zinc-200"
                        }`}
                        aria-label={`Toggle preorder status, current: ${
                          row.isActive ? "Active" : "Inactive"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-[4px] bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                            row.isActive ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-1 text-right">
                      <div className="inline-flex gap-1.5">
                        {/* Edit Button */}
                        <Link
                          href={`/${row.id}/edit`}
                          className="p-1.5 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 rounded-md transition-colors text-zinc-600"
                          aria-label="Edit preorder"
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
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                        </Link>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(row.id, row.name)}
                          className="p-1.5 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 hover:text-red-600 rounded-md transition-colors text-zinc-600 cursor-pointer"
                          aria-label="Delete preorder"
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
                              d="M14.74 9l-.346 9m-4.788 0L9.24 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card footer (Pagination) */}
        <div className="flex items-center justify-center gap-4 p-4 bg-zinc-50/50 rounded-b-xl border-t border-zinc-100 text-xs font-semibold text-zinc-600">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`p-1.5 border border-zinc-200 rounded-tl-md rounded-tr-none rounded-bl-md rounded-br-none transition-colors ${
              currentPage <= 1
                ? "text-zinc-300 border-zinc-100 cursor-not-allowed bg-[#EBEBEB]"
                : "text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer"
            }`}
            aria-label="Previous page"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <span>
            Showing {startItem} to {endItem} from {totalCount}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`p-1.5 border border-zinc-200 rounded-bl-none rounded-br-md rounded-tl-none rounded-tr-md transition-colors ${
              currentPage >= totalPages
                ? "text-zinc-300 border-zinc-100 cursor-not-allowed bg-[#EBEBEB]"
                : "text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer"
            }`}
            aria-label="Next page"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
