import PreorderForm from "../components/PreorderForm";

export const metadata = {
  title: "Create Preorder - Preorder Manager",
  description: "Create a new preorder record",
};

export default function CreatePreorderPage() {
  return <PreorderForm isEdit={false} />;
}
