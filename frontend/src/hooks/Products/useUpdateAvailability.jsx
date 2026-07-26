import { useState } from 'react';
import { updateAvailability as updateAvailabilityService } from '../../service/productService';


const useUpdateAvailability = () => {
    const [isLoading, setIsLoading] = useState(true)

    const isActive = async (id) => {
        try{
            setIsLoading(true);

            await updateAvailabilityService(id);

        }catch(error){
            console.log("Unable to update availability :", error);
            
        }finally{
            setIsLoading(false);
        }
    }

    return{
       updateAvailability: isActive,
       isLoading

    }
}

export default useUpdateAvailability;