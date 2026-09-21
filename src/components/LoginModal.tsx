import { useEffect, useState } from 'react'
import { Building2, Scale, UserRound, X } from 'lucide-react'
import { useApp } from '../App'
import type { User } from '../types'
import { Button } from './ui/button'

const accounts = [
  {role:'citizen',label:'ประชาชน',username:'citizen',name:'สมชาย ใจดี',icon:UserRound},
  {role:'lawyer',label:'ทนายความ',username:'lawyer',name:'วิภา ยุติธรรม',icon:Scale},
  {role:'officer',label:'เจ้าหน้าที่ศาล',username:'officer',name:'ณรงค์ งานศาล',icon:Building2},
] as const
export function LoginModal(){
 const {loginOpen,setLoginOpen,login} = useApp(); const [selected,setSelected]=useState(0); const [username,setUsername]=useState('citizen'); const [password,setPassword]=useState('1234'); const [error,setError]=useState('')
 useEffect(()=>{if(loginOpen)setError('')},[loginOpen]); if(!loginOpen)return null
 const choose=(i:number)=>{setSelected(i);setUsername(accounts[i].username);setPassword('1234');setError('')}
 const submit=(e:React.FormEvent)=>{e.preventDefault();const a=accounts[selected];if(username===a.username&&password==='1234')login({role:a.role,name:a.name,username:a.username} as User);else setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')}
 return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={e=>e.target===e.currentTarget&&setLoginOpen(false)}>
  <div className="modal login-modal"><button className="icon-button close" onClick={()=>setLoginOpen(false)} aria-label="ปิด"><X/></button>
   <span className="eyebrow">เข้าสู่ระบบบริการออนไลน์</span><h2 id="login-title">เลือกประเภทผู้ใช้งาน</h2><p className="muted">บัญชีทั้งหมดเป็นข้อมูลจำลองสำหรับการสาธิต</p>
   <div className="account-tabs">{accounts.map((a,i)=><button key={a.role} className={selected===i?'active':''} onClick={()=>choose(i)}><a.icon/><span>{a.label}</span></button>)}</div>
   <form onSubmit={submit} className="login-form"><label>ชื่อผู้ใช้<input value={username} onChange={e=>setUsername(e.target.value)} autoFocus/></label><label>รหัสผ่าน<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="form-error">{error}</p>}<div className="demo-hint">บัญชีทดสอบ: <b>{accounts[selected].username}</b> / <b>1234</b></div><Button fullWidth type="submit">เข้าสู่ระบบ</Button></form>
  </div></div>
}
