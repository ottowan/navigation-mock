import { ArrowUpDown, Check, Search, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ServiceCard } from '../components/ServiceCard'
import { categories, services } from '../data/services'

const audienceOptions = [
  { value: 'all', label: 'ทุกคน' },
  { value: 'citizen', label: 'ประชาชน' },
  { value: 'lawyer', label: 'ทนายความ' },
]

export function SearchPage({ allServices = false }: { allServices?: boolean }) {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [audience, setAudience] = useState('all')
  const [category, setCategory] = useState(params.get('category') || 'all')
  const [sort, setSort] = useState('recommended')

  const publicServices = useMemo(
    () => services.filter(service => service.audience.some(role => role !== 'officer')),
    [],
  )
  const categoryCounts = useMemo(() => Object.fromEntries(
    categories.map(item => [item.name, publicServices.filter(service => service.category === item.name).length]),
  ), [publicServices])

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const filtered = publicServices.filter(service =>
      (!keyword || [service.name, service.description, service.category, ...service.keywords].join(' ').toLowerCase().includes(keyword))
      && (audience === 'all' || service.audience.includes(audience as 'citizen' | 'lawyer') || service.audience.includes('all'))
      && (category === 'all' || service.category === category),
    )
    return [...filtered].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'th')
      if (sort === 'category') return a.category.localeCompare(b.category, 'th') || a.name.localeCompare(b.name, 'th')
      return Number(b.featured) - Number(a.featured)
    })
  }, [publicServices, query, audience, category, sort])

  const groupedResults = useMemo(() => categories
    .map(item => ({ ...item, items: results.filter(service => service.category === item.name) }))
    .filter(group => group.items.length), [results])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next = new URLSearchParams(params)
    query.trim() ? next.set('q', query.trim()) : next.delete('q')
    setParams(next)
  }
  const clear = () => {
    setQuery('')
    setAudience('all')
    setCategory('all')
    setSort('recommended')
    setParams({})
  }

  return <div className={`page search-page modern-services-page ${allServices ? 'services-catalog-page' : ''}`}>
    {!allServices && <div className="page-hero services-hero"><div className="container">
      <span className="eyebrow"><Sparkles /> ศูนย์รวมบริการศาลยุติธรรม</span>
      <h1>ผลการค้นหา</h1>
      <p>ค้นหาจากชื่อบริการ รายละเอียด หรือคำที่คุณเข้าใจง่าย</p>
      <form className="search-bar service-search-bar" onSubmit={submit}>
        <Search />
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="ต้องการทำอะไร เช่น ยื่นฟ้อง ตรวจสอบคดี ขอเอกสาร..." aria-label="ค้นหาบริการ" />
        {query && <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="ล้างคำค้น"><X /></button>}
        <button className="button primary">ค้นหา</button>
      </form>
    </div></div>}

    <div className={`container services-catalog ${allServices ? 'standalone-catalog' : ''}`}>
      <div className="services-catalog-layout">
      <aside className="category-sidebar" aria-label="หมวดหมู่บริการ">
        <div className="category-sidebar-head"><span>หมวดหมู่บริการ</span><small>{categories.filter(item => categoryCounts[item.name]).length} หมวด</small></div>
        <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}><span><Sparkles /></span><div><b>ทุกบริการ</b><small>ดูบริการทั้งหมด</small></div><em>{publicServices.length}</em></button>
        {categories.filter(item => categoryCounts[item.name]).map(item => {
          const Icon = item.icon
          return <button key={item.name} className={category === item.name ? 'active' : ''} onClick={() => setCategory(item.name)}><span><Icon /></span><div><b>{item.name}</b><small>{item.text}</small></div><em>{categoryCounts[item.name]}</em></button>
        })}
      </aside>

      <div className="services-catalog-main">
      <section className="service-filter-panel" aria-label="ตัวกรองบริการ">
        {allServices && <form className="catalog-service-search" onSubmit={submit}><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="ค้นหาบริการที่ต้องการ..." aria-label="ค้นหาบริการ" />{query && <button type="button" onClick={() => setQuery('')} aria-label="ล้างคำค้น"><X /></button>}</form>}
        <div className="category-filter-scroll">
          <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}><span><Sparkles /></span><b>ทุกบริการ</b><small>{publicServices.length}</small></button>
          {categories.filter(item => categoryCounts[item.name]).map(item => {
            const Icon = item.icon
            return <button key={item.name} className={category === item.name ? 'active' : ''} onClick={() => setCategory(item.name)}><span><Icon /></span><b>{item.name}</b><small>{categoryCounts[item.name]}</small></button>
          })}
        </div>
        <div className="quick-filter-row">
          <div className="audience-filter"><span>เหมาะสำหรับ</span>{audienceOptions.map(option => <button key={option.value} className={audience === option.value ? 'active' : ''} onClick={() => setAudience(option.value)}>{audience === option.value && <Check />}{option.label}</button>)}</div>
          <label><ArrowUpDown /> เรียงตาม<select value={sort} onChange={event => setSort(event.target.value)}><option value="recommended">บริการแนะนำ</option><option value="name">ชื่อบริการ ก–ฮ</option><option value="category">หมวดหมู่</option></select></label>
        </div>
      </section>

      {!allServices && <div className="results-head catalog-results-head"><div><h2>{query ? <>ผลการค้นหา “{query}”</> : 'บริการที่พบ'}</h2></div><strong>พบ {results.length} บริการ</strong></div>}
      {results.length ? allServices
        ? <div className="category-result-groups">{groupedResults.map(group => { const GroupIcon = group.icon; return <section key={group.name} className="category-result-group"><header><span><GroupIcon /></span><div><h2>{group.name}</h2><p>{group.text}</p></div><b>{group.items.length} บริการ</b></header><div className="catalog-service-grid">{group.items.map(service => <ServiceCard key={service.id} service={service} />)}</div></section> })}</div>
        : <div className="catalog-service-grid">{results.map(service => <ServiceCard key={service.id} service={service} />)}</div>
        : <div className="no-results"><Search /><h3>ไม่พบบริการที่ค้นหา</h3><p>ลองใช้คำค้นอื่น หรือล้างตัวกรองเพื่อดูบริการทั้งหมด</p><button className="button primary" onClick={clear}>ดูบริการทั้งหมด</button></div>}
      </div>
      </div>
    </div>
  </div>
}
