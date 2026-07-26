import { FiTrash2 } from "react-icons/fi";
import useDeleteItem from "../../../hooks/useDeleteItem";
import { toast } from "sonner";

const DeleteModal = ({ productId, onClose}) => {
    const { deleteItem } = useDeleteItem();

    const DeleteItem = async () => {
        try{
            await deleteItem(productId);
            toast.success("deleted succesfully");

            if(onClose){
                onClose();
            }

        }catch(error){
            console.error(error);
            toast.error("Failed to delete product");
        }
    }

    return (
        <div className="w-full">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <FiTrash2 className="text-3xl text-red-600" />
            </div>

            {/* Title */}
            <h2 className="mt-5 text-center text-2xl font-semibold text-gray-900">
                Delete Product
            </h2>

            {/* Description */}
            <p className="mt-3 text-center text-gray-500 leading-relaxed">
                You&#34;re about to permanently delete this product.
                <br />
                This action <span className="font-semibold text-gray-800">cannot be undone.</span>
            </p>

            {/* Warning Box */}
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-3">
                    <FiTrash2 className="mt-0.5 text-red-600" />

                    <div>
                        <p className="font-medium text-red-700">
                            Permanent deletion
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            All product information associated with this item
                            will be permanently removed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition-all hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    onClick={() => DeleteItem(productId)}
                    className="rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
                >
                    Delete Product
                </button>
            </div>
        </div>
    );
};

export default DeleteModal;