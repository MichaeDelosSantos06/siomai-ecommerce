import { useAuth } from "../../context/authContext";

const UserDisplayName = () => {
    const { user } = useAuth();
    return(
        <span className="flex justify-center items-center mr-[5%] font-poppins text-[15px] w-full">
            Hello, {user?.username}
        </span>
    )
}

export default UserDisplayName;