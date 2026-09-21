import { ArrowRight, Bell, BriefcaseBusiness, CalendarDays, ChevronRight, Clock3, FileClock, FolderSearch2, Search, UserRound, UsersRound } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { GuidedWizard } from '../components/GuidedWizard'
import { categories, services } from '../data/services'
import type { Service } from '../types'
import { storage } from '../utils/storage'

const filters=[{id:'all',label:'ทั้งหมด',icon:null},{id:'citizen',label:'ประชาชนทั่วไป',icon:UsersRound},{id:'lawyer',label:'ทนายความ',icon:BriefcaseBusiness},{id:'officer',label:'เจ้าหน้าที่',icon:UserRound}]
const typeClass:Record<string,string>={'API':'api','Web Link':'web','SSO':'sso','Internal':'internal'}

export function HomePage(){
  const nav=useNavigate(); const {user,requireLogin}=useApp(); const [query,setQuery]=useState(''); const [filter,setFilter]=useState('all')
  const featured=useMemo(()=>services.filter(s=>s.featured&&(filter==='all'||s.audience.includes(filter as never)||s.audience.includes('all'))).slice(0,6),[filter])
  const submit=(e:FormEvent)=>{e.preventDefault();if(query.trim())nav(`/search?q=${encodeURIComponent(query.trim())}`)}
  const openService=(service:Service)=>{storage.addRecent(service.id);if(service.authRequired&&!user){requireLogin(service.url);return}if(service.integrationType==='Web Link')nav(`/external/${service.id}`);else nav(service.url)}
  const sideLinks=[
    {label:'คดีของฉัน',detail:'ตรวจสอบสถานะคดีที่เกี่ยวข้อง',icon:FolderSearch2,to:user?'/dashboard':'/service/case-search'},
    {label:'นัดหมายที่กำลังจะถึง',detail:'ดูนัดหมายและกำหนดการ',icon:CalendarDays,to:'/service/appointment'},
    {label:'รายการล่าสุด',detail:'บริการที่คุณเข้าใช้ล่าสุด',icon:Clock3,to:user?'/dashboard':'/services'},
    {label:'สถานะคำร้อง',detail:'ติดตามความคืบหน้าคำร้อง',icon:FileClock,to:'/service/request-status'},
  ]
  return <div className="reference-home">
    <section className="ref-hero"><div className="ref-hero-photo"></div><div className="container ref-hero-content"><div className="ref-hero-main"><h1>วันนี้คุณต้องการทำอะไรเกี่ยวกับศาล?</h1><p>ค้นหาและเข้าถึงบริการออนไลน์ของศาลได้จากที่เดียว ทั้งบริการผ่านระบบ API และลิงก์เว็บไซต์</p><form className="ref-search" onSubmit={submit}><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ค้นหา เช่น ตรวจสอบคดี / ยื่นคำร้อง / ชำระค่าธรรมเนียม / ขอเอกสาร"/><button>ค้นหา</button></form><div className="ref-filters">{filters.map(item=>{const Icon=item.icon;return <button key={item.id} className={filter===item.id?'active':''} onClick={()=>setFilter(item.id)}>{Icon&&<Icon/>}{item.label}</button>})}</div></div><blockquote>“ความยุติธรรม<br/>เข้าถึงได้สำหรับทุกคน”<i></i><small>สังคมยุติธรรม<br/>เริ่มได้จากการเข้าถึงข้อมูล</small></blockquote></div></section>
    <section className="ref-content"><div className="container ref-main-grid"><div className="ref-services"><div className="ref-section-title"><h2>บริการที่ใช้บ่อย</h2><Link to="/services">ดูบริการทั้งหมด <ArrowRight/></Link></div>{featured.length?<div className="ref-service-grid">{featured.map(service=>{const Icon=service.icon;return <article className="ref-service-card" key={service.id}><div className="ref-service-info"><span className="ref-service-icon"><Icon/></span><div><h3>{service.name}</h3><p>{service.description}</p></div><span className={`integration-badge ${typeClass[service.integrationType]}`}>{service.integrationType}</span></div><button disabled={service.status!=='available'} onClick={()=>openService(service)}>{service.status==='maintenance'?'อยู่ระหว่างปรับปรุง':'เข้าสู่บริการ'}</button></article>})}</div>:<div className="empty">ไม่พบบริการสำหรับกลุ่มผู้ใช้นี้</div>}</div>
      <aside className="ref-sidebar"><Link to={user?'/dashboard':'/'} onClick={e=>{if(!user){e.preventDefault();requireLogin('/dashboard')}}} className="ref-user"><span><UserRound/></span><div><small>สวัสดี</small><b>{user?`คุณ${user.name.split(' ')[0]}`:'ผู้ใช้งาน'}</b></div><ChevronRight/></Link><h3>บริการแนะนำ</h3>{sideLinks.map(item=><Link to={item.to} key={item.label}><item.icon/><span><b>{item.label}</b><small>{item.detail}</small></span><ChevronRight/></Link>)}</aside>
    </div><div className="container ref-categories"><div className="ref-section-title"><h2>หมวดหมู่บริการ</h2></div><div className="ref-category-grid">{categories.slice(0,4).map(category=><button onClick={()=>nav(`/search?category=${encodeURIComponent(category.name)}`)} key={category.name}><category.icon/><span><b>{category.name}</b><small>{category.text}</small></span><ChevronRight/></button>)}<button onClick={()=>nav('/search?category=บริการสำหรับทนายความ')}><UsersRound/><span><b>บริการสำหรับทนายความ<br/>และเจ้าหน้าที่</b><small>บริการเฉพาะกลุ่ม แบบบูรณาการ</small></span><ChevronRight/></button></div></div></section>
    <section className="ref-notice"><div className="container"><Bell/><span><b>ประกาศการให้บริการ</b> ระบบชำระค่าธรรมเนียมอยู่ระหว่างปรับปรุง กรุณาใช้บริการอีกครั้งหลัง 23:00 น.</span><Link to="/service/court-news">ดูประกาศทั้งหมด</Link></div></section>
    <GuidedWizard/>
  </div>
}
