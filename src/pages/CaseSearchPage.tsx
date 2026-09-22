import { CalendarDays, CheckCircle2, ChevronRight, Clock3, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../App'
import { DataAccessConsent } from '../components/DataAccessConsent'
import { services } from '../data/services'

export function CaseSearchPage() {
  const { user } = useApp()
  const [caseNo, setCaseNo] = useState('ผบ.1234')
  const [year, setYear] = useState('2569')
  const [court, setCourt] = useState('ศาลจังหวัดตัวอย่าง')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(false)
  const [consented, setConsented] = useState(false)
  const service = services.find(item => item.id === 'case-search')!

  if (!user) return <Navigate to="/" />
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!consented) return
    setLoading(true)
    setResult(false)
    setTimeout(() => { setLoading(false); setResult(true) }, 700)
  }

  return <div className="page case-page">
    <div className="page-hero compact"><div className="container"><span className="eyebrow"><ShieldCheck /> เชื่อมต่อผ่าน API (จำลอง)</span><h1>ตรวจสอบข้อมูลคดี</h1><p>กรอกเลขคดี ปี พ.ศ. และศาล เพื่อดูสถานะล่าสุด</p></div></div>
    <div className="container case-layout">
      <form className="case-form" onSubmit={submit}>
        <h2>ค้นหาคดี</h2><p className="muted">กรุณากรอกข้อมูลให้ครบถ้วน</p>
        <label>เลขคดี <small>เช่น ผบ.1234</small><input value={caseNo} onChange={event => setCaseNo(event.target.value)} required /></label>
        <div className="form-row"><label>ปี พ.ศ.<input value={year} onChange={event => setYear(event.target.value)} required /></label><label>ศาล<select value={court} onChange={event => setCourt(event.target.value)}><option>ศาลจังหวัดตัวอย่าง</option><option>ศาลแพ่งตัวอย่าง</option><option>ศาลเยาวชนและครอบครัวตัวอย่าง</option></select></label></div>
        <DataAccessConsent service={service} accepted={consented} onAcceptedChange={setConsented} />
        <button className="button primary wide" disabled={loading || !consented}><Search /> {loading ? 'กำลังค้นหา...' : 'ค้นหา'}</button>
        <div className="privacy-note"><ShieldCheck /><span>ข้อมูลของท่านใช้เพื่อการค้นหาในครั้งนี้เท่านั้น<br/><small>ระบบต้นแบบไม่บันทึกข้อมูลจริง</small></span></div>
      </form>
      <div className="case-result">
        {!result && !loading && <div className="result-placeholder"><Search /><h3>ผลการค้นหาจะแสดงที่นี่</h3><p>กรอกข้อมูลและอนุญาตการเข้าถึงก่อนค้นหา</p></div>}
        {loading && <div className="result-placeholder"><span className="loader" /><h3>กำลังตรวจสอบข้อมูล...</h3></div>}
        {result && <div className="result-card"><div className="result-success"><CheckCircle2 /><div><small>พบข้อมูลคดี</small><h2>{caseNo}/{year}</h2></div><span>อยู่ระหว่างพิจารณา</span></div><dl><div><dt>ศาล</dt><dd>{court}</dd></div><div><dt>ประเภทคดี</dt><dd>คดีแพ่ง</dd></div><div><dt>สถานะล่าสุด</dt><dd>อยู่ระหว่างพิจารณา</dd></div></dl><div className="next-appointment"><CalendarDays /><div><small>วันนัดครั้งถัดไป</small><b>15 ตุลาคม 2569</b></div><div><Clock3 /><small>เวลา</small><b>09:00 น.</b></div></div><button className="detail-row">ดูรายละเอียดและประวัติการดำเนินคดี <ChevronRight /></button><p className="demo-disclaimer">ข้อมูลตัวอย่างเพื่อการสาธิต ไม่ใช่ข้อมูลคดีจริง</p></div>}
      </div>
    </div>
  </div>
}
