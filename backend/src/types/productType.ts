export type CreateProductDTO = {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>

export type ProductResponseDTO = {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}