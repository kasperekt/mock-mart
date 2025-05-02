import { ProductForm } from "@/components/admin/product-form";
import { getProduct, updateProduct } from "@/services/products";
import { redirect, notFound } from "next/navigation";
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

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const product = await getProduct(parseInt(id));

  if (!product) {
    notFound();
  }

  async function onSubmit(data: ProductFormValues) {
    "use server";
    
    await updateProduct(parseInt(id), {
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
      <h2 className="text-2xl font-semibold">Edit Product</h2>
      <ProductForm initialData={product} onSubmit={onSubmit} />
    </div>
  );
}