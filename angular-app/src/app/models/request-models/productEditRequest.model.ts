export interface ProductEditRequest {
  id: number;
  categoryId?: number | null;
  name?: string;
  description?: string;
  price?: number | null;
  imageName?: string | null;

  mainImageIndexExisting: number | null;
  mainImageIndexNew: number | null;
  deletedImageFileIds: number | null;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageName: string;
}
