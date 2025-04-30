import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import FloatingShape from './components/FloatingShape'
import LoginPage from './pages/LogInPage'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import LoadingSpinner from './components/LoadingSpinner'
import MainLayout from './layouts/MainLayout'
import { useAdminStore } from './store/adminStore'
import AdminUsersPage from './pages/UsersPage'
import AdminUserDetailPage from './pages/UserPage'
import BuyRequestsPage from './pages/BuyRequestsPage'
import BuyRequestPage from './pages/BuyRequestPage'
import SellRequestsPage from './pages/sellRequestsPage'
import SellRequestPage from './pages/sellRequestPage'
import MatchSellRequestPage from './pages/MatchSellRequestPage'
import MatchedRequestsPage from './pages/MatchedRequestsPage'
import InvestmentsPage from './pages/InvestmentsPage'

function App() {
  const ProtectedRoute = ({children})=>{
    const {isAuthenticated, user} = useAdminStore()
  
    if(!isAuthenticated){
      return <Navigate to={'/login'} replace/>
    }
  
    return children
  }
  const {isCheckingAuth, checkAuth} = useAdminStore()
  
  const RedirectAuthenticatedUser = ({children}) =>{
    const {isAuthenticated, user} = useAdminStore()
  
    if(isAuthenticated){
      return <Navigate to={'/'} replace/>
    }
    return children
  }

  const location = useLocation();

  const authRoutes = ["/signup", "/login", "/verify-email", "/forgot-password", "/reset-password"];

  const isAuthPage = authRoutes.some((path) => location.pathname.startsWith(path));

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth) return <LoadingSpinner/>
  return (
    <>
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900
      ${isAuthPage ? "flex items-center justify-center" : ""} relative overflow-hidden`}>
      <FloatingShape color= 'bg-green-500' size = 'w-64 h-64' top = '-5%' left = '10%' delay = {0}/>
      <FloatingShape color= 'bg-emerald-500' size = 'w-48 h-48' top = '70%' left = '80%' delay = {5}/>
      <FloatingShape color= 'bg-lime-500' size = 'w-32 h-32' top = '40%' left = '-10%' delay = {2}/>
      <Routes>
          <Route path='/login' element={
            <RedirectAuthenticatedUser>
              <LoginPage/>
            </RedirectAuthenticatedUser>}/>
          <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path='/users' element={<AdminUsersPage />} />
          <Route path='/users/:id' element={<AdminUserDetailPage />} />
          <Route path='/buy-requests' element={<BuyRequestsPage />} />
          <Route path='/buy-requests/:id' element={<BuyRequestPage />} />
          <Route path='/sell-requests' element={<SellRequestsPage />} />
          <Route path='/sell-requests/:id' element={<SellRequestPage />} />
          <Route path='/sell-requests/:id/match' element={<MatchSellRequestPage />} />
          <Route path='/matched-requests' element={<MatchedRequestsPage />} />
          <Route path='/investments' element={<InvestmentsPage />} />
        </Route>
      </Routes>
      <Toaster/>
      </div>
    </>
  )
}

export default App
