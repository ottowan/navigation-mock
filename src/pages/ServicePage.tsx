import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Heart, LockKeyhole, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { DataAccessConsent } from '../components/DataAccessConsent'
import { getTargetSystem, roleLabels, services } from '../data/services'
import { storage } from '../utils/storage'

export function ServicePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user, requireLogin } = useApp()
  const service = services.find(item => item.id === id)
  const [favorite, setFavorite] = useState(() => service ? storage.favorites().includes(service.id) : false)

  if (!service) return <div className="container not-found"><h1>ไม่พบบริการ</h1><Link to="/services">กลับไปบริการทั้งหมด</Link></div>
  const Icon = service.icon
  const toggle = () => {
    if (!user) { requireLogin(`/service/${service.id}`); return }
    const ids = storage.favorites()
    storage.setFavorites(ids.includes(service.id) ? ids.filter(item => item !== service.id) : [...ids, service.id])
    setFavorite(!favorite)
  }
  const destination = service.id === 'case-search'
    ? '/case-search'
    : service.integrationType === 'Web Link'
      ? `/external/${service.id}`
      : service.integrationType === 'SSO'
        ? service.url
        : service.url === '/admin' || service.url === '/dashboard'
          ? service.url
          : `/demo/${service.id}`
  const go = () => {
    storage.addRecent(service.id)
    storage.grantServiceAccess(service.id)
    if (service.authRequired && !user) return requireLogin(destination)
    nav(destination)
  }

  return <div className="page service-detail-page">
    <div className="detail-hero"><div className="container">
      <Link to="/services" className="back-link"><ArrowLeft /> กลับไปบริการทั้งหมด</Link>
      <div className="detail-title">
        <span className="detail-icon"><Icon /></span>
        <div><div className="detail-badges"><span>{service.category}</span><span>{service.integrationType}</span><span>ปลายทาง · {getTargetSystem(service)}</span></div><h1>{service.name}</h1><p>{service.description}</p></div>
        <button className={`favorite-large ${favorite ? 'selected' : ''}`} onClick={toggle}><Heart /> {favorite ? 'บันทึกแล้ว' : 'เพิ่มในรายการโปรด'}</button>
      </div>
    </div></div>

    <div className="container detail-layout">
      <article className="detail-content">
        <section><h2>เกี่ยวกับบริการนี้</h2><p>{service.description} หน้านี้จะแนะนำบริการ ขั้นตอน และข้อมูลที่จะส่งไปยังระบบปลายทางก่อนเริ่มดำเนินการ ข้อมูลทั้งหมดเป็นข้อมูลจำลองสำหรับต้นแบบ</p></section>
        <section><h2>ขั้นตอนการใช้บริการ</h2><ol className="steps-list">{service.steps.map((step, index) => <li key={step}><span>{index + 1}</span><div><b>{step}</b><p>{index === 0 ? 'ตรวจสอบบริการและข้อมูลที่ระบบปลายทางต้องใช้' : index === 1 ? 'เตรียมข้อมูลให้ครบถ้วนก่อนดำเนินรายการ' : 'ระบบจะแสดงผลและเลขอ้างอิงเมื่อสำเร็จ'}</p></div></li>)}</ol></section>
        <section><h2><FileText /> เอกสารที่ควรเตรียม</h2><ul className="check-list">{service.documents.map(document => <li key={document}><CheckCircle2 />{document}</li>)}</ul></section>
      </article>

      <aside className="detail-sidebar">
        <DataAccessConsent service={service} />
        <div className="action-panel">
          <div className={`service-status ${service.status}`}>{service.status === 'available' ? 'พร้อมให้บริการ' : 'อยู่ระหว่างปรับปรุงระบบ'}</div>
          <h3>เริ่มใช้บริการ</h3>
          <p>ช่องทาง: <b>{service.integrationType}</b></p>
          <p>ระบบปลายทาง: <b>{getTargetSystem(service)}</b></p>
          <button className="button primary wide" disabled={service.status !== 'available'} onClick={go}>{service.action} <ArrowRight /></button>
          <small><LockKeyhole /> ตรวจสอบข้อมูลที่จะแชร์ในส่วนเนื้อหาก่อนดำเนินการ</small>
          {service.authRequired && <small><LockKeyhole /> จำเป็นต้องเข้าสู่ระบบก่อนใช้งาน</small>}
        </div>
        <div className="info-panel"><h3><UserRound /> ผู้ที่ใช้บริการได้</h3><div>{service.roles.filter(role => role !== 'guest').map(role => <span key={role}>{roleLabels[role]}</span>)}</div></div>
        <div className="help-panel"><b>ต้องการความช่วยเหลือ?</b><p>โทร. 1111<br/><small>จันทร์–ศุกร์ 08:30–16:30 น.</small></p></div>
      </aside>
    </div>
    <div className="mobile-service-action"><button className="button primary wide" disabled={service.status !== 'available'} onClick={go}>{service.action} <ArrowRight /></button></div>
  </div>
}
