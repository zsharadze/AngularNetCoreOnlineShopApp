export interface Product {
  id: number;
  categoryId: number | null;
  categoryName: string | null;
  name: string;
  description: string;
  price: number | null;
  imageName: string | null;
  ordersCount: number | null;
  createdDate: Date | null;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageName: string;
}