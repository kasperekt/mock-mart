import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteProduct, getProducts } from "@/services/products";
import { revalidatePath } from "next/cache";

export async function ProductList() {
  const products = await getProducts();

  async function handleDelete(id: number) {
    "use server";
    await deleteProduct(id);
    revalidatePath("/admin");
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/admin/products/edit/${product.id}`}>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <form action={handleDelete.bind(null, product.id)}>
                  <Button variant="destructive" size="icon" type="submit">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 