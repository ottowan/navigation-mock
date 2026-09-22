import { ArrowLeft, Building2, CalendarDays, CheckCircle2, Clock3, Download, FileCheck2, MapPin, Search, Send, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DataAccessConsent } from '../components/DataAccessConsent'
import { services } from '../data/services'
import { mockCases, mockCourts, mockDocuments, mockRequests } from '../data/mockData'

export function DemoServicePage() {
  const { id } = useParams()
  const service = services.find(item => item.id === id)
  const [query, setQuery] = useState(id === 'court-finder' ? 'จังหวัดตัวอย่าง' : id === 'appointment' ? 'ผบ.1234/2569' : 'REQ-2569-001')
  const [searched, setSearched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [consented, setConsented] = useState(false)
  const resultTitle = useMemo(() => id === 'court-finder' ? 'พบศาล 2 แห่ง' : id === 'appointment' ? 'พบนัดหมาย 2 รายการ' : id === 'receipt' ? 'พบใบเสร็จ 1 รายการ' : id === 'request-status' ? 'พบคำร้อง 1 รายการ' : 'ดำเนินการสำเร็จ', [id])

  if (!service) return <div className="container not-found"><h1>ไม่พบบริการ</h1></div>
  const Icon = service.icon
  const searchMode = ['court-finder', 'court-directory', 'appointment', 'hearing-info', 'request-status', 'receipt', 'case-documents', 'court-guide', 'court-news'].includes(service.id)
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!consented) return
    searchMode ? setSearched(true) : setSubmitted(true)
  }

  return <div className="page demo-service-page">
    <div className="page-hero compact"><div className="container">
      <Link to={`/service/${service.id}`} className="back-link"><ArrowLeft /> กลับไปรายละเอียดบริการ</Link>
      <div className="demo-page-title"><span className="detail-icon"><Icon /></span><div><span className="eyebrow">ระบบบริการจำลอง</span><h1>{service.name}</h1><p>{service.description}</p></div></div>
    </div></div>
    <div className="container demo-workspace">
      <form className="demo-form" onSubmit={submit}>
        <div className="demo-form-head"><h2>{searchMode ? 'กรอกข้อมูลเพื่อค้นหา' : 'ส่งข้อมูลถึงศาล'}</h2><span><ShieldCheck /> ข้อมูลจำลอง</span></div>
        {searchMode ? <>
          <label>{id === 'court-finder' || id === 'court-directory' ? 'จังหวัด / ชื่อศาล' : id === 'appointment' || id === 'hearing-info' ? 'เลขคดี' : id === 'receipt' ? 'เลขที่ใบเสร็จ' : 'เลขที่อ้างอิง'}
            <div className="input-with-icon"><Search /><input value={query} onChange={event => setQuery(event.target.value)} required /></div>
          </label>
          {id === 'appointment' && <label>ปี พ.ศ.<select defaultValue="2569"><option>2569</option><option>2568</option></select></label>}
          <DataAccessConsent service={service} accepted={consented} onAcceptedChange={setConsented} />
          <button className="button primary wide" disabled={!consented}><Search /> ค้นหาข้อมูล</button>
        </> : <>
          <label>เรื่อง<input defaultValue={service.name} /></label>
          <label>รายละเอียด<textarea defaultValue="ต้องการสอบถามรายละเอียดและขั้นตอนการดำเนินการเพิ่มเติม" /></label>
          <label>เอกสารประกอบ<div className="upload-box"><FileCheck2 /><span>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง</span><small>PDF, JPG ไม่เกิน 10 MB</small></div></label>
          <DataAccessConsent service={service} accepted={consented} onAcceptedChange={setConsented} />
          <button className="button primary wide" disabled={!consented}><Send /> ยืนยันและส่งข้อมูล</button>
        </>}
        <p className="privacy-note"><ShieldCheck /> ระบบนี้เป็นต้นแบบและไม่มีการส่งข้อมูลเข้าสู่ระบบจริง</p>
      </form>

      <section className="demo-results">
        {!searched && !submitted && <div className="result-placeholder"><Icon /><h3>{searchMode ? 'ผลการค้นหาจะแสดงที่นี่' : 'พร้อมรับข้อมูลของคุณ'}</h3><p>{searchMode ? 'กรอกข้อมูลและอนุญาตการเข้าถึงก่อนค้นหา' : 'กรอกแบบฟอร์มและอนุญาตการเข้าถึงข้อมูล'}</p></div>}
        {searched && <div className="mock-result-panel">
          <div className="result-panel-head"><CheckCircle2 /><div><small>ผลการค้นหา</small><h2>{resultTitle}</h2></div></div>
          {(id === 'court-finder' || id === 'court-directory') && mockCourts.map(court => <article className="court-result" key={court.name}><MapPin /><div><h3>{court.name}</h3><p>{court.address}</p><span>โทร. {court.phone}</span><span>{court.hours}</span></div><button className="button ghost">ดูแผนที่</button></article>)}
          {(id === 'appointment' || id === 'hearing-info') && mockCases.slice(0, 2).map(courtCase => <article className="appointment-result" key={courtCase.id}><div className="date-box"><b>{courtCase.nextDate.split(' ')[0]}</b><small>ต.ค. 69</small></div><div><h3>{courtCase.id}</h3><p><Building2 /> {courtCase.court}</p><span><Clock3 /> {courtCase.time}</span><span><MapPin /> {courtCase.room}</span></div></article>)}
          {id === 'request-status' && mockRequests.map(request => <article className="request-result" key={request.id}><div><small>{request.id}</small><h3>{request.title}</h3><p>ยื่นเมื่อ {request.submitted}</p></div><b>{request.status}</b><div className="progress"><i style={{ width: `${request.progress}%` }} /></div></article>)}
          {id === 'receipt' && <article className="receipt-result"><div><small>เลขที่ใบเสร็จ</small><h3>RC-2569-00842</h3><p>ค่าธรรมเนียมศาล • คดี ผบ.1234/2569</p></div><div><b>1,200.00 บาท</b><button className="button ghost"><Download /> ดาวน์โหลด</button></div></article>}
          {id === 'case-documents' && mockDocuments.map(document => <article className="receipt-result" key={document.id}><div><small>{document.id}</small><h3>{document.name}</h3><p>{document.caseId} • อัปเดต {document.updated}</p></div><b>{document.status}</b></article>)}
          {['court-guide', 'court-news'].includes(id || '') && <div className="article-result"><h3>ข้อมูลและประกาศล่าสุด</h3><p>ขั้นตอนเตรียมตัวก่อนมาติดต่อศาล พร้อมรายการเอกสารและช่องทางติดต่อที่จำเป็น</p><button className="button ghost">อ่านรายละเอียด</button></div>}
        </div>}
        {submitted && <div className="submission-success"><span><CheckCircle2 /></span><h2>ส่งข้อมูลเรียบร้อยแล้ว</h2><p>ระบบได้รับรายการ “{service.name}” ของคุณแล้ว</p><div><small>เลขที่อ้างอิง</small><b>REF-2569-{String(Date.now()).slice(-5)}</b></div><p className="muted">กรุณาบันทึกเลขที่อ้างอิงสำหรับติดตามสถานะ</p><Link className="button primary" to="/dashboard">ไปยังแดชบอร์ด</Link></div>}
      </section>
    </div>
  </div>
}
