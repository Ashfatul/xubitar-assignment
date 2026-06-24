import { notFound } from "next/navigation";
import { getPreorderById } from "../../lib/actions";
import PreorderForm from "../../components/PreorderForm";

interface EditPreorderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPreorderPageProps) {
  const { id } = await params;
  return {
    title: `Edit Preorder - Preorder Manager`,
    description: `Edit preorder ${id}`,
  };
}

export default async function EditPreorderPage({
  params,
}: EditPreorderPageProps) {
  const { id } = await params;
  const preorder = await getPreorderById(id);

  if (!preorder) {
    notFound();
  }

  const initialData = {
    id: preorder.id,
    name: preorder.name,
    products: preorder.products,
    preorderWhen: preorder.preorderWhen,
    startsAt: preorder.startsAt.toISOString(),
    endsAt: preorder.endsAt ? preorder.endsAt.toISOString() : "",
    isActive: preorder.isActive,
  };

  return <PreorderForm initialData={initialData} isEdit={true} />;
}
