import { Navigate, Outlet } from "react-router-dom"


export function AdminRoutes({user}){

    if(!user){
        return <Navigate to='/Login' replace/>
    }

    if(user.role !== "ADMIN"){
        return <Navigate to="/" replace/>
    }

    return <Outlet/>
}