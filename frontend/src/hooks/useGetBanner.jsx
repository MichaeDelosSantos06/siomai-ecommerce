import { useEffect, useState } from "react"
import { getBanner } from "../service/promotionService";

export const useGetBanner = () => {
    const [activeBanner, setIsActiveBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActiveBanner = async () => {
            try{
                const banner = await getBanner();
                setIsActiveBanner(banner.data)

            }catch(error){
                console.error("NO ACTIVE BANNER:", error);  
            }finally{
                setIsLoading(false);
            }
        }

        fetchActiveBanner();
    }, []);

    return {
        isLoading,
        activeBanner
    }
}

// const useSomething = () => {

//     // ======================
//     // State
//     // ======================

//     // useState

//     // ======================
//     // Effects
//     // ======================

//     // useEffect

//     // ======================
//     // Helper Functions
//     // ======================

//     // formatData()
//     // validate()

//     // ======================
//     // Main Functions
//     // ======================

//     // fetchData()
//     // submit()
//     // deleteItem()

//     // ======================
//     // Return
//     // ======================

//     return {

//     };
// };

// export default useSomething;