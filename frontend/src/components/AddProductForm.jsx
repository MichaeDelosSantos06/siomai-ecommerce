import { toast } from "sonner";
import useAddProduct from "../hooks/useAddProduct";
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react";

const AddProductForm = ({onClose}) => {
    const { addNewProduct } = useAddProduct();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    // Watch selected image
    const imageFile = watch("image");

    // Preview image
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (!imageFile || imageFile.length === 0) {
            setPreviewImage(null);
            return;
        }

        const objectUrl = URL.createObjectURL(imageFile[0]);
        setPreviewImage(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", String(parseFloat(data.price)));
            formData.append("stock", String(parseInt(data.stock)));

            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            await addNewProduct(formData);

            reset({
                name: "",
                description: "",
                price: "",
                stock: "",
                image: null,
            });

            setPreviewImage(null);

            toast.success("New Item Added");

            if(onClose){
                onClose();
            }
        } catch (error) {
            console.error(error);
            console.log(error);
            
            toast.error("Failed to add product");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Image Upload */}
                {/* Image Upload */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Product Image
                    </label>

                    <label
                        htmlFor="image"
                        className="group relative block cursor-pointer overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 transition hover:border-[#FFA410]"
                    >
                        {previewImage ? (
                            <>
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                                />

                                <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
                                    Click to Change
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/50">
                                    <div className="text-center opacity-0 transition duration-300 group-hover:opacity-100">
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
                            </>
                        ) : (
                            <div className="flex h-48 flex-col items-center justify-center">
                                <svg
                                    className="mb-3 h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                <p className="font-medium text-[#FFA410]">
                                    Click to upload
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    PNG, JPG or GIF up to 10MB
                                </p>
                            </div>
                        )}

                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image", {
                                required: "Image is required",
                            })}
                        />
                    </label>

                    {errors.image && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.image.message}
                        </p>
                    )}
                </div>

               {/* Item Name, Price & Stock */}
                <div className="grid grid-cols-6 gap-4">
                    {/* Item Name */}
                    <div className="col-span-3">
                        <label
                            htmlFor="item"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Item Name
                        </label>

                        <input
                            type="text"
                            id="item"
                            placeholder="Enter item name"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition-all duration-200 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#FFA410]"
                            {...register("name", {
                                required: "Item name is required",
                            })}
                        />

                        <p className="mt-1 min-h-[20px] text-sm text-red-500">
                            {errors.name?.message}
                        </p>
                    </div>

                    {/* Price */}
                    <div className="col-span-2">
                        <label
                            htmlFor="price"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Price
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₱
                            </span>

                            <input
                                type="number"
                                id="price"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full rounded-xl border border-gray-300 py-3 pl-8 pr-3 text-gray-700 outline-none transition-all duration-200 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#FFA410]"
                                {...register("price", {
                                    required: "Price is required",
                                    min: {
                                        value: 0,
                                        message: "Price must be greater than or equal to 0",
                                    },
                                })}
                            />
                        </div>

                        <p className="mt-1 min-h-[20px] text-sm text-red-500">
                            {errors.price?.message}
                        </p>
                    </div>

                    {/* Stock */}
                    <div className="col-span-1">
                        <label
                            htmlFor="stock"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Stock
                        </label>

                        <div className="relative">
                            <input
                                type="number"
                                id="stock"
                                placeholder="0"
                                min="0"
                                step="1"
                                className="w-full rounded-xl border border-gray-300 py-3 px-4 text-gray-700 outline-none transition-all duration-200 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#FFA410]"
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
                    <label
                        htmlFor="desc"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>

                    <textarea
                        id="desc"
                        rows={3}
                        placeholder="Enter product description"
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-700 outline-none transition-all duration-200 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#FFA410]"
                        {...register("description", {
                            required: "Description is required",
                        })}
                    />

                    <p className="mt-1 min-h-[20px] text-sm text-red-500">
                        {errors.description?.message}
                    </p>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#FFA410] hover:bg-[#e6930e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA410] transition-all duration-200 font-poppins"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProductForm;