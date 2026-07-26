    import { z } from "zod";

    export const CreateProductSchema = z.object({
        name: z.string("Product name is required").trim().min(3, "name must be atleast 3 characters"),
        description: z.string("put a short description"),
        price: z.coerce.number("Product price is required").positive("price must be a positive number or greater than 0"),
        imageUrl: z.string().optional(),
        stock: z.coerce.number("Stock is required").positive("invalid stock")
    });
