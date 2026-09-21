import type { LucideIcon } from 'lucide-react'

export type Role = 'guest' | 'citizen' | 'lawyer' | 'officer'
export type Audience = 'citizen' | 'lawyer' | 'officer' | 'all'
export type IntegrationType = 'API' | 'Web Link' | 'SSO' | 'Internal'
export type ServiceStatus = 'available' | 'maintenance' | 'unavailable'

export interface User { role: Exclude<Role, 'guest'>; name: string; username: string }
export interface Service {
  id: string
  name: string
  description: string
  category: string
  keywords: string[]
  audience: Audience[]
  integrationType: IntegrationType
  url: string
  authRequired: boolean
  roles: Role[]
  status: ServiceStatus
  icon: LucideIcon
  featured: boolean
  action: string
  steps: string[]
  documents: string[]
}
