import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/services/products";
import { redirect } from "next/navigation";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  async function onSubmit(data: ProductFormValues) {
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