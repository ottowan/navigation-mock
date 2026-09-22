import { BellRing, Check, Database, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../App'
import { getTargetSystem } from '../data/services'
import type { Service } from '../types'

interface DataAccessConsentProps {
  service: Service
}

export function DataAccessConsent({ service }: DataAccessConsentProps) {
  const { user } = useApp()
  const [notifications, setNotifications] = useState(true)
  const personalData = service.authRequired
    ? [
        ['ชื่อและนามสกุล', user?.name ?? 'ผู้ใช้บริการ'],
        ['เลขประจำตัวประชาชน', '1-5603-000xx-xx-x'],
        ['วัน เดือน ปีเกิด', '** **** 2527'],
        ['เบอร์มือถือ', 'xxx-xxx-0640'],
        ['อีเมล', `${user?.username?.slice(0, 1) ?? 'p'}********@example.com`],
      ]
    : [
        ['ข้อมูลที่กรอกในแบบฟอร์ม', 'เฉพาะรายการที่ส่งครั้งนี้'],
        ['ข้อมูลการค้นหา', 'คำค้นและเงื่อนไขที่เลือก'],
      ]

  const serviceData = service.category === 'เอกสารและคำร้อง'
    ? ['เอกสารประกอบ', 'เฉพาะไฟล์ที่เลือกแนบ']
    : service.category === 'คดีและการดำเนินคดี'
      ? ['ข้อมูลคดี', 'เฉพาะคดีที่เลือกดำเนินการ']
      : ['ข้อมูลบริการ', service.name]

  return <section className="data-access-consent" aria-labelledby={`access-title-${service.id}`}>
    <div className="data-access-head">
      <span><LockKeyhole /></span>
      <div>
        <h3 id={`access-title-${service.id}`}>ข้อมูลที่ระบบปลายทางต้องการเข้าถึง</h3>
        <p><Database /> {getTargetSystem(service)} จะได้รับเฉพาะข้อมูลที่แสดงด้านล่าง</p>
      </div>
    </div>
    <div className="data-access-grid">
      {[...personalData, serviceData].map(([label, value]) => <div key={label}>
        <small>{label}</small><b>{value}</b>
      </div>)}
    </div>
    <div className="notification-permission">
      <span><BellRing /><span><b>เปิดการแจ้งเตือน</b><small>รับแจ้งผลและสถานะรายการจากระบบปลายทาง</small></span></span>
      <button type="button" role="switch" aria-checked={notifications} className={notifications ? 'on' : ''} onClick={() => setNotifications(value => !value)}><i>{notifications && <Check />}</i></button>
    </div>
  </section>
}
