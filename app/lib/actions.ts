"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./db";

export interface GetPreordersParams {
  filter?: "all" | "active" | "inactive";
  sortBy?: "name" | "createdAt" | "startsAt" | "endsAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export async function getPreorders(params: GetPreordersParams = {}) {
  const {
    filter = "all",
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 8,
  } = params;

  const where: any = {};
  if (filter === "active") {
    where.isActive = true;
  } else if (filter === "inactive") {
    where.isActive = false;
  }

  const skip = (page - 1) * limit;

  try {
    const [total, preorders] = await Promise.all([
      prisma.preorder.count({ where }),
      prisma.preorder.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      preorders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching preorders:", error);
    throw new Error("Failed to fetch preorders");
  }
}

export async function getPreorderById(id: string) {
  try {
    const preorder = await prisma.preorder.findUnique({
      where: { id },
    });
    return preorder;
  } catch (error) {
    console.error(`Error fetching preorder ${id}:`, error);
    throw new Error("Failed to fetch preorder");
  }
}

export async function togglePreorderStatus(id: string, isActive: boolean) {
  try {
    const updated = await prisma.preorder.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/");
    return { success: true, preorder: updated };
  } catch (error) {
    console.error(`Error toggling preorder status for ${id}:`, error);
    return { success: false, error: "Failed to update preorder status" };
  }
}

export async function deletePreorder(id: string) {
  try {
    await prisma.preorder.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(`Error deleting preorder ${id}:`, error);
    return { success: false, error: "Failed to delete preorder" };
  }
}

export async function createPreorder(formData: {
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
}) {
  try {
    const preorder = await prisma.preorder.create({
      data: {
        name: formData.name,
        products: formData.products,
        preorderWhen: formData.preorderWhen,
        startsAt: formData.startsAt,
        endsAt: formData.endsAt,
        isActive: formData.isActive,
      },
    });
    revalidatePath("/");
    return { success: true, preorder };
  } catch (error) {
    console.error("Error creating preorder:", error);
    return { success: false, error: "Failed to create preorder" };
  }
}

export async function updatePreorder(
  id: string,
  formData: {
    name: string;
    products: number;
    preorderWhen: string;
    startsAt: Date;
    endsAt: Date | null;
    isActive: boolean;
  }
) {
  try {
    const preorder = await prisma.preorder.update({
      where: { id },
      data: {
        name: formData.name,
        products: formData.products,
        preorderWhen: formData.preorderWhen,
        startsAt: formData.startsAt,
        endsAt: formData.endsAt,
        isActive: formData.isActive,
      },
    });
    revalidatePath("/");
    return { success: true, preorder };
  } catch (error) {
    console.error(`Error updating preorder ${id}:`, error);
    return { success: false, error: "Failed to update preorder" };
  }
}
