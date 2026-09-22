import type { User } from '../types'
const read = <T>(key:string, fallback:T):T => { try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback } }
export const storage = {
  user: () => read<User|null>('court-user', null),
  setUser: (user:User|null) => user ? localStorage.setItem('court-user', JSON.stringify(user)) : localStorage.removeItem('court-user'),
  favorites: () => read<string[]>('court-favorites', []),
  setFavorites: (ids:string[]) => localStorage.setItem('court-favorites', JSON.stringify(ids)),
  recent: () => read<string[]>('court-recent', []),
  addRecent: (id:string) => localStorage.setItem('court-recent', JSON.stringify([id, ...read<string[]>('court-recent', []).filter(x=>x!==id)].slice(0,5))),
  grantServiceAccess: (id:string) => sessionStorage.setItem(`court-access-${id}`, 'granted'),
  hasServiceAccess: (id:string) => sessionStorage.getItem(`court-access-${id}`) === 'granted',
}
