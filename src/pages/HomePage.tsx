import { ArrowRight, Bell, BookOpenCheck, CalendarDays, CheckCircle2, ChevronRight, FileCheck2, Gavel, Search, ShieldCheck, Sparkles, UserRound, UsersRound } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GuidedWizard } from '../components/GuidedWizard'
import { categories, getTargetSystem, services } from '../data/services'
import type { Service } from '../types'
import { storage } from '../utils/storage'

const filters = [
  { id: 'all', label: 'ทั้งหมด', icon: null },
  { id: 'citizen', label: 'ประชาชนทั่วไป', icon: UsersRound },
  { id: 'lawyer', label: 'ทนายความ', icon: BookOpenCheck },
  { id: 'officer', label: 'เจ้าหน้าที่', icon: UserRound },
]

const integrationClass: Record<string, string> = { API: 'api', 'Web Link': 'web', SSO: 'sso', Internal: 'internal' }

const quickActions = [
  { title: 'ค้นหา', text: 'ค้นหาคดี ศาล และข้อมูลที่ต้องการ', icon: Search, to: '/services' },
  { title: 'ยื่น', text: 'ยื่นคำร้องและเอกสารผ่านช่องทางออนไลน์', icon: FileCheck2, to: '/service/online-request' },
  { title: 'ติดตาม', text: 'ติดตามคดี คำร้อง และวันนัดหมาย', icon: CalendarDays, to: '/service/request-status' },
  { title: 'ตรวจสอบ', text: 'ตรวจเอกสาร ประกาศ และข้อมูลจากศาล', icon: ShieldCheck, to: '/service/document-validation' },
]

const heroServices = ['case-search', 'online-request', 'appointment', 'fees']

export function HomePage() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const featured = useMemo(() => services
    .filter(service => filter === 'all' || service.audience.includes(filter as never) || service.audience.includes('all'))
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 8), [filter])

  const heroItems = heroServices.map(id => services.find(service => service.id === id)).filter(Boolean) as Service[]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (query.trim()) nav(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const openService = (service: Service) => {
    storage.addRecent(service.id)
    nav(`/service/${service.id}`)
  }

  return <div className="portal-home">
    <section className="portal-hero">
      <div className="portal-orb portal-orb-one" />
      <div className="portal-orb portal-orb-two" />
      <div className="container portal-hero-grid">
        <div className="portal-hero-copy">
          <span className="portal-kicker"><Sparkles /> ศูนย์กลางบริการศาลยุติธรรม</span>
          <h1>เรื่องศาล<br/><em>จัดการง่ายในที่เดียว</em></h1>
          <p>ค้นหา ยื่น ติดตาม และตรวจสอบบริการของศาลได้จากจุดเดียว สะดวก ปลอดภัย และพร้อมใช้งานทุกที่</p>
          <form className="portal-search" onSubmit={submit}>
            <Search />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="ค้นหาบริการ เช่น ตรวจสอบคดี ค่าธรรมเนียม วันนัด" />
            <button>ค้นหา</button>
          </form>
          <div className="portal-hero-actions">
            <Link className="portal-primary-action" to="/services">ดูบริการทั้งหมด <ArrowRight /></Link>
            <a className="portal-secondary-action" href="#service-guide">ช่วยฉันเลือกบริการ</a>
          </div>
        </div>

        <div className="portal-showcase" aria-label="ตัวอย่างบริการออนไลน์">
          <div className="portal-showcase-glow" />
          <div className="portal-device">
            <div className="portal-device-head">
              <span><Gavel /></span>
              <div><b>บริการศาลออนไลน์</b><small>เลือกบริการที่ต้องการ</small></div>
              <Bell />
            </div>
            <div className="portal-device-search"><Search /> ค้นหาบริการ...</div>
            <div className="portal-device-grid">
              {heroItems.map(service => {
                const Icon = service.icon
                return <button key={service.id} onClick={() => openService(service)}>
                  <span><Icon /></span><b>{service.name}</b>
                </button>
              })}
            </div>
            <div className="portal-device-safe"><ShieldCheck /> เชื่อมต่อบริการอย่างปลอดภัย</div>
          </div>
          <div className="portal-float-card portal-float-top"><CheckCircle2 /><span><b>พร้อมให้บริการ</b><small>ตลอด 24 ชั่วโมง</small></span></div>
          <div className="portal-float-card portal-float-bottom"><UsersRound /><span><b>{services.length} บริการ</b><small>สำหรับทุกกลุ่มผู้ใช้</small></span></div>
        </div>
      </div>
    </section>

    <section className="portal-intro">
      <div className="container">
        <p>เข้าถึงบริการของศาลยุติธรรมได้ทันที</p>
        <h2>วันนี้คุณต้องการจัดการเรื่องใด?</h2>
        <div className="portal-quick-grid">
          {quickActions.map(item => <Link to={item.to} key={item.title}>
            <span><item.icon /></span>
            <div><h3>{item.title}</h3><p>{item.text}</p></div>
            <ChevronRight />
          </Link>)}
        </div>
      </div>
    </section>

    <section className="portal-popular">
      <div className="container">
        <div className="portal-section-head">
          <div><span>บริการสำหรับคุณ</span><h2>บริการยอดนิยม</h2><p>เลือกใช้บริการได้ตามบทบาทและสิ่งที่คุณต้องการดำเนินการ</p></div>
          <Link to="/services">ดูบริการทั้งหมด <ArrowRight /></Link>
        </div>
        <div className="portal-filter-row">
          {filters.map(item => {
            const Icon = item.icon
            return <button key={item.id} className={filter === item.id ? 'active' : ''} onClick={() => setFilter(item.id)}>
              {Icon && <Icon />}{item.label}
            </button>
          })}
        </div>
        <div className="portal-service-grid">
          {featured.map(service => {
            const Icon = service.icon
            return <article key={service.id}>
              <div className="portal-card-top">
                <span className="portal-card-icon"><Icon /></span>
                <div className="portal-card-tags">
                  <span className={`integration-badge ${integrationClass[service.integrationType]}`}>{service.integrationType}</span>
                  <span className="target-system-badge">{getTargetSystem(service)}</span>
                </div>
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button disabled={service.status !== 'available'} onClick={() => openService(service)}>
                {service.status === 'available' ? service.action : 'อยู่ระหว่างปรับปรุง'} <ArrowRight />
              </button>
            </article>
          })}
        </div>
      </div>
    </section>

    <section className="portal-categories">
      <div className="container">
        <div className="portal-section-head centered"><div><span>ค้นหาได้ง่ายกว่าเดิม</span><h2>บริการแยกตามหมวดหมู่</h2><p>เลือกจากประเภทงานเพื่อไปยังบริการที่ตรงกับความต้องการ</p></div></div>
        <div className="portal-category-grid">
          {categories.map(category => <button key={category.name} onClick={() => nav(`/search?category=${encodeURIComponent(category.name)}`)}>
            <span><category.icon /></span>
            <div><b>{category.name}</b><small>{category.text}</small></div>
            <ChevronRight />
          </button>)}
        </div>
      </div>
    </section>

    <section className="portal-trust">
      <div className="container">
        <div><ShieldCheck /><span><b>ปลอดภัยและน่าเชื่อถือ</b><small>แสดงระบบที่เชื่อมต่ออย่างชัดเจน</small></span></div>
        <div><CheckCircle2 /><span><b>ข้อมูลบริการครบถ้วน</b><small>บอกขั้นตอนและเอกสารที่ควรเตรียม</small></span></div>
        <div><UsersRound /><span><b>เข้าถึงง่ายสำหรับทุกคน</b><small>รองรับประชาชน ทนายความ และเจ้าหน้าที่</small></span></div>
      </div>
    </section>

    <section id="service-guide" className="portal-guide-wrap"><GuidedWizard /></section>
  </div>
}
