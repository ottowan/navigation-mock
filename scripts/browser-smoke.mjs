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

const routes = ['/', '/services', '/search?q=คดี', '/service/case-search']
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

await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
await page.locator('.portal-service-grid article').filter({ hasText: 'ตรวจสอบข้อมูลคดี' }).getByRole('button').click()
await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).last().click()
await page.waitForURL('**/case-search')
await page.getByRole('checkbox').check()
await page.getByRole('button', { name: 'ค้นหา', exact: true }).click()
await page.getByText('พบข้อมูลคดี').waitFor()
console.log(`case flow: ${await page.getByText('ผบ.1234/2569').count()} result`)

await page.goto(`${baseURL}/demo/court-finder`, { waitUntil: 'domcontentloaded' })
await page.getByRole('checkbox').check()
await page.getByRole('button', { name: 'ค้นหาข้อมูล' }).click()
await page.getByText('พบศาล 2 แห่ง').waitFor()
console.log(`court finder flow: ${await page.locator('.court-result').count()} results`)

await page.goto(`${baseURL}/dashboard`, { waitUntil: 'domcontentloaded' })
await page.getByText('คดีและคำร้องของฉัน').waitFor()
console.log(`dashboard flow: ${await page.locator('.record-column').count()} record groups`)

await page.setViewportSize({ width: 1440, height: 1000 })
await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
await page.screenshot({ path: `${process.env.TEMP}/court-portal-desktop.png`, fullPage: true })
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
await page.locator('.portal-hero').waitFor()
await page.screenshot({ path: `${process.env.TEMP}/court-portal-mobile.png`, fullPage: true })
console.log(`mobile flow: viewport=${JSON.stringify(page.viewportSize())}`)

console.log(`errors: ${errors.length}`)
for (const error of errors) console.log(error)
await browser.close()
if (errors.length) process.exitCode = 1
