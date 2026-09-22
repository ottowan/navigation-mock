import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { DataAccessConsent } from '../components/DataAccessConsent'
import { getTargetSystem, services } from '../data/services'

export function ExternalPage() {
  const { id } = useParams()
  const { user } = useApp()
  const [continued, setContinued] = useState(false)
  const [consented, setConsented] = useState(false)
  const service = services.find(item => item.id === id)
  if (!service) return <Navigate to="/" />
  if (service.authRequired && !user) return <Navigate to="/" />

  return <div className="external-page"><div className="external-card access-external-card">
    {!continued ? <>
      <span className="external-icon"><ExternalLink /></span>
      <span className="eyebrow">กำลังเชื่อมต่อระบบปลายทาง</span>
      <h1>ส่งต่อไปยัง {getTargetSystem(service)}</h1>
      <p>ตรวจสอบข้อมูลที่จะส่งเพื่อใช้บริการ “{service.name}” ก่อนดำเนินการต่อ</p>
      <div className="external-info"><span>ชื่อบริการ</span><b>{service.name}</b><span>ระบบปลายทาง</span><b>{getTargetSystem(service)}</b></div>
      <DataAccessConsent service={service} accepted={consented} onAcceptedChange={setConsented} />
      <div className="external-actions"><Link className="button ghost" to={`/service/${service.id}`}><ArrowLeft /> ยกเลิก</Link><button className="button primary" disabled={!consented} onClick={() => setContinued(true)}>อนุญาตและดำเนินการต่อ <ArrowRight /></button></div>
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
