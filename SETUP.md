# ตั้งค่า Supabase + Deploy ขึ้น Vercel (ฟรีทั้งหมด)

โปรเจคนี้ใช้ **Supabase** ครบทั้ง 3 อย่าง: Postgres (ฐานข้อมูล), Auth (ล็อกอินหน้า `/admin`)
และ Storage (เก็บรูปที่อัปโหลด) — ทั้งหมดอยู่ใน free tier ขั้นตอนด้านล่างจะพาไปตั้งค่าให้ครบ

## 1. สร้างโปรเจค Supabase (ฟรี)

1. ไปที่ https://supabase.com → สมัคร/ล็อกอิน → **New Project**
2. ตั้งชื่อโปรเจค เลือก region ที่ใกล้ที่สุด (เช่น Singapore) แล้วตั้งรหัสผ่านฐานข้อมูล (เก็บไว้ให้ดี)
3. รอสักครู่ให้โปรเจคสร้างเสร็จ

## 2. คัดลอกค่า API

ไปที่ **Project Settings → API** แล้วคัดลอก:

- **Project URL** → ใส่ใน `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → ใส่ใน `NEXT_PUBLIC_SUPABASE_ANON_KEY`

ใส่ในไฟล์ `.env` (สำหรับรันในเครื่อง) และใน Vercel Environment Variables (ตอน deploy)

## 3. สร้าง Storage bucket สำหรับรูปภาพ

**วิธีที่ง่ายที่สุด** — รันคำสั่งนี้ (ต้องตั้ง `DIRECT_URL` ใน `.env` ก่อน ดูขั้นตอนที่ 5):

```bash
npm run setup:storage
```

สคริปต์จะสร้าง bucket แบบ public (จำกัด 10MB เฉพาะไฟล์รูป) พร้อม RLS policy ให้ครบ:
คนทั่วไปดูรูปได้ แต่อัปโหลด/ลบได้เฉพาะคนที่ล็อกอินแล้ว — รันซ้ำได้ปลอดภัย

<details>
<summary>หรือจะสร้างเองผ่าน Dashboard ก็ได้</summary>

ไปที่ **Storage** ในเมนูซ้าย → **New bucket**

- ชื่อ bucket: `media` (หรือชื่ออื่น แล้วแก้ `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` ให้ตรงกัน)
- ติ๊ก **Public bucket** (เพื่อให้รูปโหลดขึ้นเว็บได้โดยไม่ต้องล็อกอิน)

จากนั้นไปที่แท็บ **Policies** ของ bucket นี้ แล้วเพิ่ม policy อนุญาตให้ผู้ใช้ที่ล็อกอินแล้ว
(`authenticated`) สามารถ `INSERT` (อัปโหลด) ไฟล์ได้ — Supabase มี template
"Allow authenticated uploads" ให้เลือกใช้ได้เลย

</details>

> **วิธีเช็คว่า bucket มีจริงหรือยัง** — ถ้าอัปโหลดแล้วเจอ `Bucket not found` ให้ลองเปิด URL นี้
> (แทน `<project-ref>` ด้วยของคุณ):
> `https://<project-ref>.supabase.co/storage/v1/object/public/media/x.png`
> - ขึ้น `Object not found` = bucket มีแล้ว ✅
> - ขึ้น `Bucket not found` = ยังไม่มี ต้องสร้างก่อน ❌

## 4. สร้างบัญชี Admin

ไปที่ **Authentication → Users → Add user** แล้วกรอกอีเมล/รหัสผ่านที่จะใช้ล็อกอินหน้า `/admin`
(โปรเจคนี้ไม่มีหน้าสมัครสมาชิกสาธารณะ ต้องสร้างบัญชีจาก Supabase Dashboard เท่านั้น เพื่อความปลอดภัย)

## 5. เปลี่ยนฐานข้อมูลจาก SQLite เป็น Supabase Postgres

1. ไปที่ **Project Settings → Database → Connection string** แล้วคัดลอก **2 ค่า**:

   - **Transaction pooler** (port 6543) → ใส่ใน `DATABASE_URL` — ตัวเว็บใช้ค่านี้ เหมาะกับ
     serverless/Vercel
   - **Direct connection** (port 5432) → ใส่ใน `DIRECT_URL` — ใช้เฉพาะตอนรัน
     `prisma migrate` / `prisma studio` เท่านั้น

   > **ทำไมต้องมี 2 ค่า?** ตัว pooler (PgBouncer แบบ transaction mode) ไม่รองรับ advisory
   > lock ที่ Prisma migration ต้องใช้ ถ้าใช้ pooler รัน migrate จะค้างไม่จบ จึงต้องแยก
   > connection สำหรับ migration ออกมาต่างหาก

   หมายเหตุ: ถ้ารหัสผ่านมีอักขระพิเศษ (เช่น `+`, `@`, `#`) ต้อง URL-encode ก่อน
   เช่น `+` → `%2B`

2. แก้ `prisma/schema.prisma` เปลี่ยน datasource provider:

   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

3. ลบ migration เดิมที่สร้างไว้สำหรับ SQLite แล้วสร้างใหม่สำหรับ Postgres:

   ```bash
   rm -rf prisma/migrations
   npx prisma migrate dev --name init
   ```

4. รัน seed อีกครั้งเพื่อใส่ข้อมูล Portfolio เริ่มต้น (ถ้ายังไม่เคยกรอกผ่านหน้า Admin):

   ```bash
   npm run db:seed
   ```

## 6. Deploy ขึ้น Vercel (ฟรี)

โปรเจคนี้ deploy ผ่าน **Vercel CLI** ตรงๆ ได้เลย ไม่ต้องต่อ GitHub:

```bash
vercel login          # ครั้งแรกครั้งเดียว
vercel link --yes --project watt-dev
vercel --prod --yes
```

หรือจะใช้วิธี push ขึ้น GitHub แล้วกด **New Project** ใน vercel.com ก็ได้ (ได้ auto-deploy
ทุกครั้งที่ push เป็นของแถม)

ไม่ว่าจะวิธีไหน ต้องใส่ Environment Variables ให้ครบ 5 ตัว: `DATABASE_URL`, `DIRECT_URL`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`

### ⚠️ กับดักสำคัญ: `DIRECT_URL` บน Vercel ต้องไม่ใช่ direct connection

ถ้าใส่ direct connection (`db.<ref>.supabase.co:5432`) เป็น `DIRECT_URL` บน Vercel
build จะพังด้วย:

```
Error: P1001: Can't reach database server at db.<ref>.supabase.co:5432
```

**สาเหตุ:** direct connection ของ Supabase free tier เป็น **IPv6-only** แต่ build machine
ของ Vercel เป็น IPv4 จึงต่อไม่ถึง

**วิธีแก้:** บน Vercel ให้ตั้ง `DIRECT_URL` เป็น **Session pooler** — host เดียวกับ pooler
แต่ใช้ port **5432** (ไม่ใช่ 6543):

```
postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

Session pooler เป็น IPv4 และรองรับ advisory lock ที่ `prisma migrate deploy` ต้องใช้
(ต่างจาก transaction pooler port 6543 ที่ไม่รองรับ)

> ในเครื่องตัวเองยังใช้ direct connection ต่อไปได้ตามปกติ — และ**ควรใช้** เพราะ
> `prisma migrate dev` ต้องสร้าง shadow database ซึ่งทำผ่าน pooler ไม่ได้

### ตั้ง region ให้ตรงกับ Supabase

`vercel.json` ตั้ง `"regions": ["hnd1"]` (โตเกียว) ไว้ให้ตรงกับ Supabase ที่อยู่
`ap-northeast-1` ถ้าย้าย Supabase ไป region อื่น อย่าลืมแก้ตรงนี้ด้วย ไม่งั้นทุก query
จะวิ่งข้ามทวีปทำให้เว็บช้า

เท่านี้เว็บก็จะขึ้นออนไลน์ พร้อมระบบแก้ไขข้อมูลผ่านหน้า `/admin` ✅

## หลังจาก deploy

- แก้ไขข้อมูล Portfolio/บล็อกได้ที่ `https://<your-domain>/admin`
- ทุกครั้งที่แก้ schema (`prisma/schema.prisma`) ต้องรัน `npx prisma migrate dev` แล้ว commit
  โฟลเดอร์ `prisma/migrations` ขึ้น git ด้วย — คำสั่ง `npm run build` มี `prisma migrate deploy`
  อยู่แล้ว Vercel จึงรัน migration ให้อัตโนมัติตอน deploy

## หมายเหตุสำหรับ Windows

ถ้าเจอ error `An Application Control policy has blocked this file` ตอนรัน `npm run dev`
นั่นคือนโยบายความปลอดภัยของ Windows บล็อกไฟล์ native ของ Next.js ไม่ใช่ปัญหาของโค้ด
โปรเจคนี้ตั้งค่ารองรับไว้แล้ว 2 จุด:

1. `package.json` ใช้ `next dev --webpack` / `next build --webpack` แทน Turbopack
   (Turbopack ต้องใช้ native bindings เท่านั้น ทำงานบน WASM ไม่ได้)
2. `next.config.ts` ตั้ง `config.output.hashFunction = "sha256"` เพราะ hash แบบ
   `xxhash64` ของ webpack ใช้ WebAssembly ซึ่งพังในสภาพแวดล้อมเดียวกันนี้
   (build จะตายด้วย `TypeError ... at WasmHash._updateWithBuffer`)
3. `next.config.ts` ปิด webpack filesystem cache สำหรับ **ทุก** production build
   (ทั้งในเครื่องและบน Vercel) เพราะ cache จะอ่านค่ากลับมาเป็น `undefined` ทำให้ build
   **ที่กู้ cache อุ่นๆ** ตายด้วย `TypeError: The "data" argument must be of type string...`
   — เกิดทั้งตอน build รอบสองในเครื่อง และบน Vercel ตอน deploy รอบสองที่กู้ cache จาก
   deploy ก่อนกลับมา (deploy รอบแรกผ่านเสมอเพราะยังไม่มี cache — อาการนี้หลอกง่ายมาก)
   เสีย cache ไปแลกความเสถียร คุ้มกว่า เพราะ build ใช้เวลาแค่ ~1 นาที
