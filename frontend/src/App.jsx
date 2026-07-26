
import './App.css'
import Home from './pages/Home'
import Navigation from './components/Navigation'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import { Toaster } from 'sonner'
import AdminPage from './pages/AdminDashboard'
import { AdminRoutes } from './components/adminDashboard/AdminRoutes'
import { useAuth } from './context/authContext'
import { UserRoutes } from './components/UserRoutes'
import AdminPageLayout from './components/adminDashboard/AdminPageLayout'
import AdminMenuItems from './pages/AdminMenuItems'
import AdminCustomerPage from './pages/AdminCustomerPage'
import CartSummary from './pages/CartSummaryPage'
import OrderMenu from './pages/OrderMenuPage'

function App() {  
  const { user, loading } = useAuth();
  if(loading){
      return <div>loading...</div>
  }
  return (
    <>
    <Toaster/>
      <Routes> 
        <Route path='/Login' element={<LoginPage/>}/>

        <Route element={<UserRoutes user={user}/>}>
          <Route element={<Layout/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/Cart' element={<CartSummary/>}/>
            <Route path='/OrderMenu' element={<OrderMenu/>}/>
          </Route>
        </Route>


        <Route element={<AdminRoutes user={user}/>}>
          <Route element={<AdminPageLayout/>}>
              <Route path='/Admin' element={<AdminPage/>}/>
              <Route path='/Menu' element={<AdminMenuItems/>}/>
              <Route path='/Customer' element={<AdminCustomerPage/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
