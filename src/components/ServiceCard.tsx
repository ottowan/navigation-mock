import { ArrowRight, Heart, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import type { Service } from '../types'
import { storage } from '../utils/storage'

const integrationClass:Record<string,string>={'API':'api','Web Link':'web','SSO':'sso','Internal':'internal'}
export function ServiceCard({service,compact=false}:{service:Service;compact?:boolean}){const nav=useNavigate();const {user,requireLogin}=useApp();const [favorite,setFavorite]=useState(()=>storage.favorites().includes(service.id));useEffect(()=>{ setFavorite(storage.favorites().includes(service.id)) },[service.id])
 const toggle=(e:React.MouseEvent)=>{e.stopPropagation();if(!user){requireLogin(`/service/${service.id}`);return}const ids=storage.favorites();const next=ids.includes(service.id)?ids.filter(x=>x!==service.id):[...ids,service.id];storage.setFavorites(next);setFavorite(!favorite)}
 const open=()=>{storage.addRecent(service.id);if(service.authRequired&&!user){requireLogin(service.url);return}if(service.integrationType==='Web Link')nav(`/external/${service.id}`);else if(service.url.startsWith('/'))nav(service.url);else nav(`/service/${service.id}`)}
 const Icon=service.icon;return <article className={`service-card ${compact?'compact':''}`}><div className="service-top"><span className="service-icon"><Icon/></span><span className={`integration-badge ${integrationClass[service.integrationType]}`}>{service.integrationType}</span>{user&&<button className={`favorite ${favorite?'selected':''}`} onClick={toggle} aria-label="รายการโปรด"><Heart/></button>}</div><h3>{service.name}</h3><p>{service.description}</p><div className={`service-status ${service.status}`}>{service.status==='available'?'พร้อมให้บริการ':service.status==='maintenance'?'อยู่ระหว่างปรับปรุงระบบ':'ไม่พร้อมให้บริการ'}</div><button onClick={open} disabled={service.status!=='available'} className="card-action">{service.status==='maintenance'?<><Wrench/> อยู่ระหว่างปรับปรุง</>:<>{service.action}<ArrowRight/></>}</button></article>}
