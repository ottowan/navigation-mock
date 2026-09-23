import { chromium } from 'playwright-core'

const baseURL = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5173'
console.log(`starting smoke test at ${baseURL}`)
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
console.log('browser launched')
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.setDefaultTimeout(8000)
page.setDefaultNavigationTimeout(8000)
const errors = []
page.on('console', message => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`)
})
page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))

const routes = ['/', '/services', '/popular', '/search?q=คดี', '/service/case-search']
for (const route of routes) {
  console.log(`opening ${route}`)
  await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(500)
  const mainCount = await page.locator('main').count()
  const mainText = mainCount ? (await page.locator('main').innerText()).trim() : ''
  const heading = await page.locator('h1').count() ? await page.locator('h1').first().textContent() : null
  console.log(`${route}: main=${mainCount}, ${mainText.length} chars, h1=${JSON.stringify(heading)}`)
  if (!mainCount) console.log(`body=${(await page.locator('body').innerText()).slice(0, 300)}`)
}

if (errors.length) {
  console.log(`errors before flow: ${errors.length}`)
  for (const error of errors) console.log(error)
  await browser.close()
  process.exit(1)
}

await page.goto(`${baseURL}/services`, { waitUntil: 'domcontentloaded' })
await page.locator('.service-filter-panel').getByLabel('ค้นหาบริการ').waitFor()
if (await page.getByRole('heading', { name: 'บริการสำหรับประชาชน' }).count()) throw new Error('services hero should not be displayed')
const publicServiceCount = await page.locator('.catalog-service-grid .service-card').count()
if (publicServiceCount < 40) throw new Error(`expected a comprehensive public catalog, found ${publicServiceCount} services`)
await page.getByRole('button', { name: /กฎหมายและคำพิพากษา/ }).click()
await page.getByRole('heading', { name: 'กฎหมายและคำพิพากษา', exact: true }).last().waitFor()
const legalServiceCount = await page.locator('.catalog-service-grid .service-card').count()
if (legalServiceCount < 5) throw new Error(`expected legal research services, found ${legalServiceCount}`)
await page.goto(`${baseURL}/popular`, { waitUntil: 'domcontentloaded' })
const popularServiceCount = await page.locator('.popular-services-grid .service-card').count()
if (popularServiceCount < 4) throw new Error(`expected popular services, found ${popularServiceCount}`)
await page.screenshot({ path: `${process.env.TEMP}/court-popular-desktop.png`, fullPage: true })
console.log(`services catalog: ${publicServiceCount} public services, ${popularServiceCount} popular services, ${legalServiceCount} legal services`)

await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
await page.locator('.portal-service-grid article').filter({ hasText: 'ตรวจสอบข้อมูลคดี' }).getByRole('button').click()
await page.getByRole('heading', { name: 'ข้อมูลที่ต้องการเข้าถึง' }).waitFor()
await page.getByRole('button', { name: /ตรวจสอบข้อมูล/ }).last().click()
await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).last().click()
await page.waitForURL('**/case-search')
await page.getByRole('button', { name: 'ค้นหา', exact: true }).click()
await page.getByText('พบข้อมูลคดี').waitFor()
console.log(`case flow: ${await page.getByText('ผบ.1234/2569').count()} result`)

await page.goto(`${baseURL}/service/court-finder`, { waitUntil: 'domcontentloaded' })
await page.getByRole('button', { name: /ค้นหาศาล/ }).last().click()
await page.waitForURL('**/demo/court-finder')
await page.getByRole('button', { name: 'ค้นหาข้อมูล' }).click()
await page.getByText('พบศาล 2 แห่ง').waitFor()
console.log(`court finder flow: ${await page.locator('.court-result').count()} results`)

await page.goto(`${baseURL}/dashboard`, { waitUntil: 'domcontentloaded' })
await page.getByText('คดีและคำร้องของฉัน').waitFor()
console.log(`dashboard flow: ${await page.locator('.record-column').count()} record groups`)

await page.setViewportSize({ width: 1440, height: 1000 })
await page.goto(`${baseURL}/services`, { waitUntil: 'domcontentloaded' })
await page.screenshot({ path: `${process.env.TEMP}/court-services-desktop.png`, fullPage: true })
await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
await page.screenshot({ path: `${process.env.TEMP}/court-portal-desktop.png`, fullPage: true })
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(`${baseURL}/popular`, { waitUntil: 'domcontentloaded' })
const popularMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
if (popularMobileOverflow) throw new Error('popular services page causes horizontal overflow on mobile')
await page.screenshot({ path: `${process.env.TEMP}/court-popular-mobile.png`, fullPage: false })
await page.goto(`${baseURL}/services`, { waitUntil: 'domcontentloaded' })
const servicesMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
if (servicesMobileOverflow) throw new Error('services catalog causes horizontal overflow on mobile')
await page.screenshot({ path: `${process.env.TEMP}/court-services-mobile.png`, fullPage: false })
await page.goto(`${baseURL}/service/appointment`, { waitUntil: 'domcontentloaded' })
await page.getByRole('heading', { name: 'ข้อมูลที่ต้องการเข้าถึง' }).waitFor()
await page.locator('.mobile-service-action').getByRole('button', { name: /ตรวจสอบวันนัด/ }).waitFor()
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
if (mobileOverflow) throw new Error('service detail causes horizontal overflow on mobile')
await page.screenshot({ path: `${process.env.TEMP}/court-consent-mobile.png`, fullPage: false })
await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
await page.locator('.portal-hero').waitFor()
await page.screenshot({ path: `${process.env.TEMP}/court-portal-mobile.png`, fullPage: true })
console.log(`mobile flow: viewport=${JSON.stringify(page.viewportSize())}`)

console.log(`errors: ${errors.length}`)
for (const error of errors) console.log(error)
await browser.close()
if (errors.length) process.exitCode = 1
