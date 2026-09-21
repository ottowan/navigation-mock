import { CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { services } from '../data/services'

export function SsoPage(){
  const {id}=useParams(); const {user}=useApp(); const [done,setDone]=useState(false)
  const service=services.find(s=>s.id===id)
  useEffect(()=>{const timer=setTimeout(()=>setDone(true),1400);return()=>clearTimeout(timer)},[])
  if(!user||!service)return <Navigate to="/"/>
  return <div className="external-page"><div className="external-card sso-card">
    {!done?<><span className="external-icon"><LoaderCircle className="spin"/></span><span className="eyebrow"><ShieldCheck/> Single Sign-On</span><h1>กำลังตรวจสอบสิทธิ์การใช้งาน...</h1><p>ระบบกำลังยืนยันบัญชีและสิทธิ์ของคุณอย่างปลอดภัย</p><div className="sso-progress"><i></i></div></>:<><span className="external-icon success"><CheckCircle2/></span><span className="eyebrow">ยืนยันตัวตนสำเร็จ</span><h1>เข้าสู่ระบบสำเร็จ</h1><p>คุณมีสิทธิ์เข้าใช้งาน “{service.name}”</p><Link className="button primary wide" to="/dashboard">เปิดระบบงานเจ้าหน้าที่</Link></>}
  </div></div>
}
