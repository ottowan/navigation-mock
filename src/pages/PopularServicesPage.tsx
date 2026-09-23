import { ArrowRight, Flame, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ServiceCard } from '../components/ServiceCard'
import { services } from '../data/services'

export function PopularServicesPage() {
  const popularServices = services.filter(service => service.featured && service.audience.some(role => role !== 'officer'))

  return <div className="page popular-services-page">
    <section className="popular-services-hero">
      <div className="container popular-services-hero-inner">
        <div>
          <span className="popular-services-kicker"><Flame /> บริการที่มีผู้ใช้งานบ่อย</span>
          <h1>บริการยอดนิยม</h1>
          <p>เข้าถึงบริการศาลที่ประชาชนใช้งานเป็นประจำได้อย่างรวดเร็ว</p>
        </div>
        <div className="popular-services-stat"><Sparkles /><span><b>{popularServices.length}</b><small>บริการแนะนำ</small></span></div>
      </div>
    </section>

    <section className="container popular-services-content">
      <div className="popular-services-heading"><div><span>เลือกบริการ</span><h2>เริ่มต้นจากบริการที่คุณต้องการ</h2></div><Link to="/services">ดูบริการทั้งหมด <ArrowRight /></Link></div>
      <div className="popular-services-grid">
        {popularServices.map((service, index) => <div className="popular-service-item" key={service.id}>
          <span className="popular-rank"><Flame /> อันดับ {index + 1}</span>
          <ServiceCard service={service} />
        </div>)}
      </div>
    </section>
  </div>
}
