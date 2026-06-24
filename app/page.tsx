import Link from "next/link";
import { getPreorders } from "./lib/actions";
import PreordersTable from "./components/PreordersTable";

export const dynamic = "force-dynamic";

interface PreordersPageProps {
  searchParams: Promise<{
    filter?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function PreordersPage({
  searchParams,
}: PreordersPageProps) {
  const params = await searchParams;

  const filter = (params.filter || "all") as "all" | "active" | "inactive";
  const sortBy = (params.sortBy || "createdAt") as
    | "name"
    | "createdAt"
    | "startsAt"
    | "endsAt";
  const sortOrder = (params.sortOrder || "desc") as "asc" | "desc";
  const page = parseInt(params.page || "1", 10);
  const limit = 8;

  const { preorders, total, totalPages } = await getPreorders({
    filter,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  return (
    <div className="flex-1 bg-[#F1F1F1] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Preorders
          </h1>
          <Link
            href="/create"
            className="bg-black hover:bg-zinc-800 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
          >
            Create Preorder
          </Link>
        </div>

        {/* Preorders Table */}
        <PreordersTable
          initialPreorders={preorders.map((p) => ({
            ...p,
            startsAt: p.startsAt.toISOString(),
            endsAt: p.endsAt ? p.endsAt.toISOString() : null,
            createdAt: p.createdAt.toISOString(),
          }))}
          totalCount={total}
          currentPage={page}
          limit={limit}
          totalPages={totalPages}
          currentFilter={filter}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </div>
    </div>
  );
}
