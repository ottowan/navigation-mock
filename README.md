# Court Navigation Portal

เว็บต้นแบบศูนย์กลางบริการออนไลน์ศาลยุติธรรม พัฒนาด้วย React, TypeScript, Vite, React Router และ Lucide Icons โดยใช้ข้อมูลจำลองและ Local Storage เท่านั้น

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173`

## บัญชีทดสอบ

- ประชาชน: `citizen` / `1234`
- ทนายความ: `lawyer` / `1234`
- เจ้าหน้าที่: `officer` / `1234`

## ตรวจสอบ Production Build

```bash
npm run build
npm run preview
```

## Deploy ผ่าน GitHub ไป Netlify

โปรเจกต์มี `netlify.toml` สำหรับกำหนด build และ React Router SPA fallback แล้ว

1. Push source code ขึ้น GitHub โดยไม่ต้องนำ `node_modules` หรือ `dist` ขึ้นไป
2. ใน Netlify เลือก **Add new project → Import an existing project**
3. เลือก GitHub และ repository นี้
4. Netlify จะอ่านค่าจาก `netlify.toml` อัตโนมัติ:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node.js: `22`
5. กด **Deploy site**

เมื่อ push commit ใหม่เข้า production branch, Netlify จะ build และ deploy ให้โดยอัตโนมัติ

ข้อมูล ชื่อบุคคล คดี และบริการทั้งหมดเป็นข้อมูลจำลองเพื่อการนำเสนอเท่านั้น
