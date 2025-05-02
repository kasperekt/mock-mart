import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/services/products";
import { redirect } from "next/navigation";

export default function NewProductPage() {
  async function onSubmit(data: any) {
    "use server";
    
    await createProduct({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image,
    });

    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Add New Product</h2>
      <ProductForm onSubmit={onSubmit} />
    </div>
  );
} 