import { ProductForm } from "@/components/admin/product-form";
import { getProduct, updateProduct } from "@/services/products";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProduct(parseInt(params.id));

  if (!product) {
    notFound();
  }

  async function onSubmit(data: any) {
    "use server";
    
    await updateProduct(parseInt(params.id), {
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