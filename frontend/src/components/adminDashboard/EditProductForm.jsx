import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useEditProduct from "../../hooks/useEditProduct";

const EditProductForm = ({ product, onClose }) => {

    const { editProduct } = useEditProduct();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm();

    useEffect(() => {

        if (product) {

            reset({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
            });

        }

    }, [product, reset]);

    const imageFile = watch("image");

    const [previewImage, setPreviewImage] = useState(product.imageUrl);

    useEffect(() => {
        if (!imageFile || imageFile.length === 0) {
            setPreviewImage(product.imageUrl);
            return;
        }

        const objectUrl = URL.createObjectURL(imageFile[0]);
        setPreviewImage(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile, product.imageUrl]);

    const onSubmit = async (data) => {

        try {

            // if handling images
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("stock", String(parseInt(data.stock)));

            if (data.image && data.image[0]) {

                formData.append("image", data.image[0]);

            }

            await editProduct(product.id, formData);

            toast.success("Product Updated");

            if (onClose) {

                onClose();

            }

        } catch (error) {

            console.error(error);

            toast.error("Failed to update product");

        }

    };

 return (
    <div className="flex flex-col h-full">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Edit Product
        </h2>

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col"
        >
            <div className="space-y-4">
                {/* Product Image Upload */}
                <div>
                    <label
                        htmlFor="image"
                        className="group relative block cursor-pointer overflow-hidden rounded-xl border border-gray-200"
                    >
                        <img
                            src={previewImage}
                            alt="product"
                            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        {/* Click Badge */}
                        <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
                            Click to Change
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
                            <div className="text-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                                <svg
                                    className="mx-auto h-8 w-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>

                                <p className="mt-2 text-sm font-medium text-white">
                                    Change Image
                                </p>
                            </div>
                        </div>
                    </label>

                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("image")}
                    />
                </div>

                {/* Name, Price & Stock */}
                <div className="grid grid-cols-4 gap-4">
                    {/* Name */}
                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Item Name
                        </label>

                        <input
                            type="text"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FFA410] focus:ring-2 focus:ring-[#FFA410]/20"
                            {...register("name", {
                                required: "Item name is required",
                            })}
                        />

                        <p className="mt-1 min-h-[20px] text-sm text-red-500">
                            {errors.name?.message}
                        </p>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Price
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₱
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full rounded-xl border border-gray-300 py-3 pl-8 pr-3 outline-none transition focus:border-[#FFA410] focus:ring-2 focus:ring-[#FFA410]/20"
                                {...register("price", {
                                    required: "Price is required",
                                })}
                            />
                        </div>

                        <p className="mt-1 min-h-[20px] text-sm text-red-500">
                            {errors.price?.message}
                        </p>
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Stock
                        </label>

                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                className="w-full rounded-xl border border-gray-300 py-3 px-4 outline-none transition focus:border-[#FFA410] focus:ring-2 focus:ring-[#FFA410]/20"
                                {...register("stock", {
                                    required: "Stock is required",
                                    min: {
                                        value: 0,
                                        message: "Stock must be greater than or equal to 0",
                                    },
                                })}
                            />
                        </div>

                        <p className="mt-1 min-h-[20px] text-sm text-red-500">
                            {errors.stock?.message}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Description
                    </label>

                    <textarea
                        rows={3}
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FFA410] focus:ring-2 focus:ring-[#FFA410]/20"
                        {...register("description", {
                            required: "Description is required",
                        })}
                    />

                    <p className="mt-1 min-h-[20px] text-sm text-red-500">
                        {errors.description?.message}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-gray-200 pt-5">
                <button
                    type="submit"
                    className="w-full rounded-xl bg-[#FFA410] py-3 font-medium text-white transition duration-200 hover:bg-[#e6930e]"
                >
                    Update Product
                </button>
            </div>
        </form>
    </div>
);
};

export default EditProductForm;