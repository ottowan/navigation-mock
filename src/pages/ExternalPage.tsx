import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { getTargetSystem, services } from '../data/services'
import { storage } from '../utils/storage'

export function ExternalPage() {
  const { id } = useParams()
  const { user } = useApp()
  const [continued, setContinued] = useState(false)
  const service = services.find(item => item.id === id)
  if (!service) return <Navigate to="/" />
  if (service.authRequired && !user) return <Navigate to="/" />
  if (!storage.hasServiceAccess(service.id)) return <Navigate to={`/service/${service.id}`} replace />

  return <div className="external-page"><div className="external-card access-external-card">
    {!continued ? <>
      <span className="external-icon"><ExternalLink /></span>
      <span className="eyebrow">กำลังเชื่อมต่อระบบบริการ</span>
      <h1>ส่งต่อไปยัง {getTargetSystem(service)}</h1>
      <p>คุณอนุญาตข้อมูลสำหรับบริการ “{service.name}” แล้ว พร้อมส่งต่อไปยังระบบที่เชื่อมต่อ</p>
      <div className="external-info"><span>ชื่อบริการ</span><b>{service.name}</b><span>ระบบที่เชื่อมต่อ</span><b>{getTargetSystem(service)}</b></div>
      <div className="external-actions"><Link className="button ghost" to={`/service/${service.id}`}><ArrowLeft /> ยกเลิก</Link><button className="button primary" onClick={() => setContinued(true)}>ดำเนินการต่อ <ArrowRight /></button></div>
    </> : <>
      <span className="external-icon success"><ShieldCheck /></span>
      <span className="eyebrow">DEMO EXTERNAL SERVICE</span>
      <h1>{service.name}</h1>
      <p>อนุญาตการเข้าถึงข้อมูลและเชื่อมต่อกับ {getTargetSystem(service)} สำเร็จแล้ว</p>
      <div className="mock-external"><ShieldCheck /><b>เชื่อมต่อบริการจำลองสำเร็จ</b><span>พร้อมเริ่มกรอกข้อมูลคำร้อง</span></div>
      <Link className="button primary wide" to="/dashboard">กลับไปแดชบอร์ด</Link>
    </>}
  </div></div>
}
