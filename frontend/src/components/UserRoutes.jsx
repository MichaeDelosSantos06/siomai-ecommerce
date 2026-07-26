import { Navigate, Outlet } from "react-router-dom"

export function UserRoutes({ user }){

    if(!user){
        return <Navigate to='/Login' replace/>
    }  
    
    return <Outlet/>
}