import { useEffect, useState } from "react";
import { getUserInfo as getUserInfoService} from "../../service/authService";
import { getTotalUser as getTotalUserService } from "../../service/authService";
import { getTotalUserNew as getTotalUserNewService} from "../../service/authService";
import { getTotalUserVip as getTotalUserVipService} from "../../service/authService";

const useGetUserInfo = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [vipUser, setVipUser] = useState(0);
    const [newUser, setNewUser] = useState(0);
    const [totalUser, setTotalUser] = useState(0);

    const getUserInfo = async () => {
        try{
            setIsLoading(true);

            const [
                info,
                total,
                vip,
                newest
            ] = await Promise.all([
                getUserInfoService(),
                getTotalUserService(),
                getTotalUserVipService(),
                getTotalUserNewService(),  
            ]);

            setUserInfo(info.data);
            setTotalUser(total.data);
            setVipUser(vip.data);
            setNewUser(newest.data);
            
        }catch(error){
            console.error("Failed Getting User Info:", error);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return {
        userInfo,
        vipUser,
        newUser,
        totalUser,
        isLoading,
        refetch: getUserInfo,
    }
}


export default useGetUserInfo;