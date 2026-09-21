import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { User } from './types'
import { storage } from './utils/storage'
import { Layout } from './layouts/Layout'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { ServicePage } from './pages/ServicePage'
import { CaseSearchPage } from './pages/CaseSearchPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import { ExternalPage } from './pages/ExternalPage'
import { SsoPage } from './pages/SsoPage'

interface AppContextValue { user:User|null; login:(u:User)=>void; logout:()=>void; loginOpen:boolean; setLoginOpen:(v:boolean)=>void; pendingPath:string|null; requireLogin:(path:string)=>void }
const AppContext = createContext<AppContextValue>(null!)
export const useApp = () => useContext(AppContext)

export function App(){
  const [user,setUser] = useState<User|null>(()=>storage.user())
  const [loginOpen,setLoginOpen] = useState(false)
  const [pendingPath,setPendingPath] = useState<string|null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(()=>window.scrollTo({top:0,behavior:'smooth'}),[location.pathname])
  const login=(u:User)=>{ storage.setUser(u); setUser(u); setLoginOpen(false); if(pendingPath){navigate(pendingPath);setPendingPath(null)} }
  const logout=()=>{storage.setUser(null);setUser(null);navigate('/')}
  const requireLogin=(path:string)=>{setPendingPath(path);setLoginOpen(true)}
  return <AppContext.Provider value={{user,login,logout,loginOpen,setLoginOpen,pendingPath,requireLogin}}>
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/services" element={<SearchPage allServices/>}/>
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/service/:id" element={<ServicePage/>}/>
        <Route path="/case-search" element={<CaseSearchPage/>}/>
        <Route path="/dashboard" element={user?<DashboardPage/>:<Navigate to="/"/>}/>
        <Route path="/admin" element={user?.role==='officer'?<AdminPage/>:<Navigate to="/"/>}/>
        <Route path="/external/:id" element={<ExternalPage/>}/>
        <Route path="/sso/:id" element={user?<SsoPage/>:<Navigate to="/"/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Route>
    </Routes>
  </AppContext.Provider>
}
