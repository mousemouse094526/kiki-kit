# skill ตระกูล warroom ทำงานต่อกันอย่างไร

[English](flow.md) · **ไทย**

รันอะไร ลำดับไหน, แต่ละ skill ทำอะไร, หยุดรอคุณตรงไหน

**หลักจำง่าย:** วางแผนต่อกันเอง (warroom → legal → tickets) · build ทีละ
ticket ทีละ **session ใหม่** · debug เริ่มเองเมื่อ build เจอ error ที่อธิบายไม่ได้ ·
trial คุณสั่งเสมอ

## 1. เส้นทางทั้งหมด

```mermaid
flowchart LR
    W["/warroom"]
    L["warroom-legal"]
    T["warroom-tickets"]
    B["/warroom-build<br/>ทีละ ticket"]
    D["warroom-debug"]
    R["/warroom-build<br/>--review-feature"]
    TR["/warroom-trial"]

    W -->|auto, ก่อน gate| L
    W -->|auto, หลัง Approve| T
    T -->|คุณวาง build prompt<br/>ใน session ใหม่| B
    B -->|auto, failure ที่อธิบายไม่ได้| D
    B -->|คุณ, ticket done ครบ| R
    R -->|คุณ, แอปรันบนเครื่อง| TR
```

**"auto" = ต่อกันใน session เดียว · "คุณ" = skill หยุดรอคุณ**
- `/warroom-build` ทีละ ticket แต่ละครั้ง session ใหม่ จนครบ
- trial เจออะไร → หัวข้อ 8 · ข้อที่เลือกกลายเป็น ticket ใหม่ แล้ววน build →
  review → trial จนเรียบร้อย แล้ว merge
- legal กับ debug รันเดี่ยวได้: `/warroom-legal`, `/warroom-debug`

**คำสั่งที่พิมพ์จริง:**

```
/warroom                                          ← วางแผน + ได้ ticket
/warroom-build auth-user-company 01               ← session ใหม่ต่อ ticket; จบแต่ละใบจะได้คำสั่งของใบถัดไป
/warroom-build auth-user-company --review-feature
/warroom-trial auth-user-company
```

## 2. ด่านเดียวที่ต้นทาง — spec ต้อง ready ก่อน

```mermaid
flowchart LR
    G{"Gate"}
    RD["ready-to-build"]
    DR["draft<br/>→ /warroom รอบหน้า"]
    TK["warroom-tickets"]

    G -->|Open Questions ว่าง| RD --> TK
    G -->|ยังมีข้อที่บล็อก| DR
```

คำถามที่ไม่ถูกถามตอนวางแผน จะไปโผล่ตอน build — กลางโค้ด, context ใกล้เต็ม,
ไม่มี red team กับ legal เช็ค เลยกันไว้ที่ต้นทาง

- spec มี `Status: draft | ready-to-build` และ `## Open Questions`
- gate กด **Approve** ได้เมื่อ Open Questions ว่าง (หรือทุกข้อบอกว่าไม่บล็อก)
- verdict กฎหมายที่เป็น `UNVERIFIED` ก็บล็อก — จนกว่าจะมีแหล่งอ้างอิง หรือคุณยอมรับความเสี่ยง
- ยังไม่พร้อม → **Stop as draft** ได้ prompt กลับมา `/warroom` พร้อมรายการคำถาม
- tickets และ build **ไม่รับ** spec ที่เป็น `draft`

## 3. warroom — วางแผน

```mermaid
flowchart LR
    I["สัมภาษณ์<br/>ทีละคำถาม"]
    DOC["เขียนเอกสาร"]
    LG["warroom-legal"]
    RT["Red team<br/>5 subagent"]
    S["ADR sweep"]
    G{"Gate"}
    TK["warroom-tickets"]

    I --> DOC --> LG --> RT --> S --> G
    G -->|Approve| TK
```

ทุกขั้นใน session เดียว — gate คือจุดเดียวที่คุณตัดสิน

| ขั้น | ทำอะไร | คุณ |
|---|---|---|
| สัมภาษณ์ | ถามทีละข้อ มีตัวเลือกแนะนำ · ค้นโค้ด / ADR / docs ก่อนถาม · ตอบไม่ได้ → Open Question | ตอบ |
| เขียนเอกสาร | spec (มี Library assumptions + Testing decisions), decisions (D1…), flow | — |
| legal | กฎหมายไทยทีละเรื่อง → `legal.md` · `UNVERIFIED` บล็อก gate | ตอบถ้ากำกวม |
| Red team | Advocate (ผู้ใช้) · **Builder** (เปิด docs library จริง, เดินงานแทนคนทำหาเรื่องที่ต้องถาม) · Breaker (เจาะ) · Tester (test ได้ไหม) · Skeptic (จำเป็นไหม) | ตอบเรื่องที่ต้องตัดสิน |
| ADR sweep | หา decision ที่เป็นกฎระดับโปรเจค ร่าง ADR | — |
| Gate | สรุป + Open Questions | **Approve** / **Adjust** / **Stop as draft** |

**หลัง Approve:** หั่น ticket ต่อใน session เดิม — หรือถ้า context ยาวแล้ว
ได้ `/warroom-tickets {slug}` ไปวางใน session ใหม่

**ได้:** `docs/features/{slug}/` spec, decisions, flow, legal · `docs/adr/` · `CONTEXT.md`

**เปิด feature เดิม** (`/warroom {slug}`): ถามเฉพาะแถว `→ /warroom` ใน
`open-items.md` + Open Questions → D ใหม่ → legal + Breaker → gate → ตัด ticket ใหม่

### 3.1 map mode — งานใหญ่เกิน session เดียว

```mermaid
flowchart LR
    I["ถามไม่กี่ข้อ<br/>ประเมินขนาด"]
    M["session 1<br/>วาด map.md แล้วหยุด"]
    R["session ถัดไป<br/>ตอบทีละคำถาม"]
    DOC["map ว่าง<br/>→ เขียนเอกสาร"]
    G{"Gate"}

    I -->|decision ค้าง ≥ 5| M --> R
    R -->|Open + Fog หมด| DOC --> G
```

decision ค้างราว 5 ข้อขึ้นไป และตอบแล้วจะมีคำถามใหม่ตามมา → วาดแผนที่ก่อน
แทนที่จะถามจน context หมด

| ส่วนใน `map.md` | มีอะไร |
|---|---|
| Destination | ปลายทาง เช่น "spec ที่ ready-to-build สำหรับ …" กำหนดขอบเขต |
| Decided | หนึ่งบรรทัดต่อข้อ ลิงก์ไป D |
| Open | คำถามที่พูดได้ชัดแล้ว + ชนิด (interview / sketch / research / task) + รอข้อไหน |
| Fog | เรื่องที่รู้ว่ามาแน่ แต่ยังตั้งเป็นคำถามไม่ได้ |
| Out of scope | เลยปลายทาง ไม่กลับมาอีก |

- session 1 วาดแล้ว **หยุด** · session ถัดไป `/warroom {slug}` ตอบทีละข้อ **บันทึกก่อนทำอย่างอื่น**
- Open + Fog หมด → เขียนเอกสาร → legal → red team → ADR → gate ตามปกติ

**เพิ่มในการสัมภาษณ์ทุกแบบ:** ถามเรื่องคุณภาพ 2–3 ข้อที่ feature นี้กระทบจริง
(เร็ว/โหลด, ระบบที่พึ่งล่ม, ใครเห็นข้อมูล) · ไม่แต่งเหตุผลให้ — ไม่มีก็เขียน
`rationale not recorded` · พูดไม่พอ → ร่างหยาบ (ตารางสถานะ, mockup ข้อความ) ไม่ใช่โค้ด ·
seam เลือกตัวที่มีอยู่แล้ว สูงสุด น้อยสุด · เปลี่ยนทิศทั้งก้อน = feature ใหม่

## 4. warroom-legal — กฎหมายไทย

ทีละเรื่อง ได้คำตัดสินเดียว: **ALLOWED** (อ้างมาตรา) · **NOT ALLOWED** (เหตุผล) ·
**CONDITIONAL** (ต้องมีอะไร → เข้า spec และ ticket) · ข้อกำกวมถามคุณ ไม่เดา ·
ไม่ใช่คำปรึกษาทางกฎหมาย

## 5. warroom-tickets — หั่นงาน

```mermaid
flowchart LR
    C["อ่านเอกสาร<br/>spec ต้อง ready"]
    CV["ตั้ง conventions<br/>ถ้ายังไม่มี"]
    EX["สำรวจโค้ด<br/>หา prefactor"]
    DR["ร่าง ticket"]
    Q{"คุณอนุมัติ?"}
    WR["เขียน ticket<br/>+ build prompt"]

    C --> CV --> EX --> DR --> Q
    Q -->|ใช่| WR
```

| ขั้น | ทำอะไร | คุณ |
|---|---|---|
| อ่าน | spec `draft` → หยุด ส่ง `/warroom` · มี ticket อยู่แล้ว → ถามตัดใหม่ไหม (ใบที่ยังไม่ done เรียงเลขใหม่) | ตอบ |
| conventions | ส่วนไหนยังไม่มีกติกา → เสนอโครงโฟลเดอร์ + เครื่องมือ test → `.claude/skills/{framework}-{surface}/` | อนุมัติ / ปรับ |
| สำรวจโค้ด | โค้ดเดิมที่ต้องจัด → ticket prefactor เลขแรก | — |
| ร่าง | แต่ละใบครบหน้าจอถึง DB · เดินทุกใบแทนคนทำ: เรื่องโครงสร้าง → ใส่ conventions เลย · เรื่องพฤติกรรม → แถว `→ /warroom` ใน open-items หยุดโดยไม่เขียน ticket | — |
| อนุมัติ | ใหญ่/เล็ก, Blocked by, รวม/แยก | ตอบจนพอใจ |
| เขียน | `tickets/NN-*.md` + build prompt (เช็ค commit เอกสาร, branch, docker, secret, งานค้าง) | commit แล้ววาง prompt ใน session ใหม่ |

## 6. warroom-build — ทีละ ticket

```mermaid
flowchart LR
    P["เลือก ticket"]
    CX["อ่าน conventions<br/>+ docs library"]
    TDD["TDD<br/>red → green"]
    E2E["e2e"]
    RV["test ทั้งหมด<br/>+ review 3 แกน"]
    CM["commit · done"]

    P --> CX --> TDD --> E2E --> RV --> CM
```

**ทำไมทีละ ticket ทีละ session:** context สะอาด อ่านเฉพาะที่ใบนั้นใช้ · review
ดูเฉพาะ diff ของใบนั้น · หนึ่งใบหนึ่ง commit ย้อนได้ทีละใบ · ความจำอยู่ในไฟล์
(ticket, decisions, open-items) ไม่ใช่แชท

| ขั้น | ทำอะไร | คุณ |
|---|---|---|
| เริ่ม | มีงานค้างไม่ commit → ถาม: commit แยกก่อน หรือ stash | ตอบ |
| เลือก | ใบที่ระบุ หรือเลขต่ำสุดที่เริ่มได้ · ใบค้าง `in-progress` → อ่านแถวใน open-items แล้วถามทำต่อไหม | — |
| เตรียม | conventions (ไม่มี → หยุด → `/warroom-tickets`) · ตารางเวอร์ชัน · โน้ต `docs/library-notes/` ของเวอร์ชันที่ติดตั้ง | ตอบเรื่องอัปเกรด (แนะนำ: อยู่เดิม) |
| TDD | เกณฑ์ทีละข้อ red → green ที่ seam ที่ตกลงไว้ | — |
| e2e | เกณฑ์ `(e2e)` เขียนหลังโค้ดผ่าน | — |
| ตรวจ | full suite + typecheck + lint · review **Standards / Spec / Newcomer** พร้อมกัน · แก้แล้วโค้ดเปลี่ยน → รัน suite อีกรอบ | — |
| commit | `feat({slug}): {title} (#NN)` · ไม่ push | session ใหม่ ใบถัดไป |

**ครบทุกใบ** → `--review-feature`: review 3 แกนทั้ง branch + แถว `→ feature review`
ใน open-items → คุณเลือกข้อที่แก้

### 6.1 build เจอเรื่องที่เอกสารไม่ได้ตัดสิน

```mermaid
flowchart LR
    X{"เรื่องที่<br/>ยังไม่ตัดสิน"}
    U["ใช้คำตอบนั้น"]
    A["ถามคุณ → บันทึก<br/>ทำต่อ"]
    S["หยุด · open-items<br/>→ flow ที่ปิดได้"]

    X -->|เอกสารตอบแล้ว| U
    X -->|วิธีทำในใบนี้เท่านั้น| A
    X -->|อย่างอื่นทั้งหมด| S
```

**build ทำตาม decision ไม่สร้าง decision** — decision ที่ทำตอน build ข้าม red team
และ legal

| กรณี | build ทำ |
|---|---|
| ค้นแล้วเจอ (decisions ทั้งไฟล์, ADR, spec, conventions, reference) | ใช้เลย ไม่ถาม |
| วิธีทำในใบนี้เท่านั้น (ข้อความ error, ค่า default, rules ของ layer ใหม่) | ถาม บอกว่าค้นที่ไหนแล้ว → D ใหม่ หรือ conventions ตอบให้จบ → ทำต่อ |
| กระทบ spec / ใบอื่น / legal / ADR / D เดิม · หั่นมาทำไม่ได้ · เอกสารขัดกัน · ไม่แน่ใจ | หยุด → แถวใน open-items (`→ /warroom` หรือ `→ /warroom-tickets`) |
| error อธิบายไม่ได้ | เรียก debug → ได้ fix → ทำต่อ |
| test พังอยู่ก่อนแล้ว | ไม่แก้ → แถว `→ /warroom-debug` |
| review เกินขอบเขตใบ | แถว `→ feature review` |
| ใหญ่ ทำไม่จบ | หยุดท้ายกลุ่มเกณฑ์ commit ส่วนที่ผ่านเป็น `wip` · แถว `→ /warroom-build` |

**ไม่จบ session ทั้งที่โค้ดยังไม่ commit** ตอนหยุด:

1. ถาม: เก็บโค้ดไว้ branch `wip/{slug}-{NN}` (แนะนำ) หรือทิ้ง
2. commit เอกสาร — สถานะ ticket, แถวใน open-items — บน branch ของ feature
   ซึ่ง flow ถัดไปอ่านจากตรงนั้น
3. ย้ายโค้ดไป `wip/` หรือทิ้ง

## 7. warroom-debug — หาสาเหตุ bug

```mermaid
flowchart LR
    RP["ทำให้ fail<br/>ทุกครั้ง"]
    SC["บีบขอบเขต<br/>docs · git"]
    FP["หาจุดพัง"]
    H["สมมติฐาน<br/>ลองล้มก่อน"]
    FX["แก้ + test"]
    PM["postmortem"]

    RP --> SC --> FP --> H --> FX --> PM
```

ไม่เดาก่อนทำ fail ได้ · ทุกขั้นจดใน `bugs/{date}-{slug}.md` ในโฟลเดอร์ feature (หรือ `docs/bugs/`) ทันที

- ทำ fail ไม่ได้ → หยุด ขอ log · แถว `→ /warroom-debug`
- โค้ดตรงเอกสารเป๊ะ → ไม่ใช่ bug แต่ spec gap · แถว `→ /warroom`
- ทุกการทดลองจดลง ledger · subagent **Outsider** อ่านแค่ record ให้ความเห็นคนนอก
- postmortem ไม่โทษใคร · งานป้องกันถามคุณก่อน ตอบใช่ถึงเป็น ticket
- รันเดี่ยว → ถามก่อน commit · อยู่บน default branch → เสนอ branch `fix/{slug}`
- bug ที่เห็นสาเหตุทันทีไม่ต้องใช้ skill นี้ แก้ได้เลย

## 8. warroom-trial — ผู้ใช้สมมุติลองแอป

```mermaid
flowchart LR
    S["ticket done<br/>+ แอปรัน local"]
    C["เลือก persona"]
    G["เป้าหมาย<br/>ภาษาคน"]
    RUN["persona ลอง<br/>ทีละคน"]
    TRI["คัดแยก"]
    P{"คุณเลือก"}

    S --> C --> G --> RUN --> TRI --> P
```

persona เป็น subagent **ไม่เห็นโค้ด ไม่เห็น spec** ใช้ browser จริง ตอบภาษาเดียวกับแอป ·
trial ไม่แก้อะไรเอง

| ประเภท | ความหมาย | เลือกแล้วไปไหน |
|---|---|---|
| **bug** | แอปไม่ตรง spec | debug ทันที แก้ + test (e2e ถ้าเห็นบนจอ) |
| **spec gap** | spec ไม่ได้พูด / ผิด | แถว `→ /warroom` |
| **friction** | ตรง spec แต่ใช้ยาก | ticket ใหม่ มีเกณฑ์ `(e2e)` |
| **works as intended** | คาดหวังสิ่งที่ D ตัดไปแล้ว | จดไว้ อ้าง D |

- ข้อที่ไม่เลือก → `open` ใน `user-trials/{date}.md`
- trial ไม่ commit: ลิสต์ไฟล์ที่เขียนไว้ แล้ว build รอบถัดไปจะถามเรื่อง commit
- subagent เปิด browser ไม่ได้ → หยุด ไม่เล่นเป็น persona เอง

## 9. `open-items.md` — งานค้างทั้ง feature ที่เดียว

```
| # | Ticket | From         | Found                       | Next               | Status      |
| 1 | 04     | build stop   | ต้องมี session store ก่อน      | → /warroom-tickets | → ticket 05 |
| 2 | 04     | review: Spec | ...                         | → feature review   | open        |
| 3 | 06     | decision     | suspend แล้ว logout ทันทีไหม  | → /warroom         | → D32       |
| 4 | —      | trial        | ...                         | → /warroom         | open        |
```

| คอลัมน์ | ความหมาย |
|---|---|
| **From** | มาจากไหน: `tickets`, `build stop`, `decision`, `review: {แกน}`, `feature review`, `full suite`, `debug`, `trial` |
| **Next** | flow ที่ปิดมัน: `→ /warroom`, `→ /warroom-tickets`, `→ /warroom-debug`, `→ /warroom-build`, `→ feature review` |
| **Status** | `open` จน flow นั้นปิด → `→ ticket NN` / `→ D{n}` / `done (sha)` / `done (ticket NN)` / `done (bugs/{record})` / `dropped (เหตุผล)` |

skill ที่ปิดเป็นคนแก้ Status · build prompt ไม่ออกถ้ามีแถว `→ /warroom` หรือ
`→ /warroom-tickets` ค้าง · `--review-feature` ไม่แนะนำ merge ถ้ายังมีแถว `open`

### 9.1 กลับไปแก้ — เมื่อ skill หยุดแล้วส่งคุณไปที่อื่น

```mermaid
flowchart LR
    B["/warroom-build<br/>ticket 04 หยุด"]
    OI["แถวใน open-items<br/>Next → /warroom"]
    W["/warroom slug<br/>เปิด feature เดิม"]
    G{"Gate"}
    T["warroom-tickets<br/>หั่นใหม่ถ้าต้อง"]
    B2["/warroom-build<br/>ทำ 04 ต่อ"]

    B -->|เขียนแถว commit เอกสาร| OI
    OI -->|คุณ session ใหม่| W
    W -->|ถามเฉพาะแถวนั้น| G
    G -->|Approve: แถว → D| T
    T -->|คุณวาง build prompt| B2
```

**หยุดไม่ใช่ทางตัน: แถวบอกว่าคุณต้องรันคำสั่งไหนต่อ**
- รันทันทีหลังหยุด ใน session ใหม่ ไม่ต้องรอ ticket อื่นเสร็จ
- `/warroom` เปิด feature เดิม: spec กลับเป็น `draft` ถามเฉพาะแถวที่ส่งมา ได้ D ใหม่ legal กับ Breaker แล้วเข้า gate กด Approve แล้วปิดแถวให้
- ระหว่างนั้น ticket ที่ไม่ขึ้นกับใบที่หยุด build ต่อได้

| Next ของแถว | คุณรัน | ปิดแถวเป็น |
|---|---|---|
| `→ /warroom` | `/warroom {slug}` | `→ D{n}` หรือ `done (docs fixed)` |
| `→ /warroom-tickets` | `/warroom-tickets {slug}` | `→ ticket NN` |
| `→ /warroom-build` | `/warroom-build {slug}` (ทำใบที่ `in-progress` ต่อ) | `done (ticket NN)` |
| `→ /warroom-debug` | `/warroom-debug` กับ bug ในแถว | `done (bugs/{record})` |
| `→ feature review` | ยังไม่ต้องทำ — `--review-feature` หยิบเอง | `done ({sha})` หรือแถวใหม่ |

## โฟลเดอร์ที่ได้

```
docs/
├── README.md                    ← แผนผัง: แต่ละโฟลเดอร์คืออะไร ใครเขียน อ่านเมื่อไหร่
├── features/{slug}/             ← ทุกอย่างของ feature อยู่ที่เดียว
│   ├── spec.md  decisions.md  flow.md  legal.md  open-items.md  (map.md)
│   ├── tickets/                 ← งานทีละใบ
│   ├── user-trials/             ← ผล trial ของผู้ใช้สมมุติ
│   └── bugs/                    ← บันทึกการไล่ bug ของ feature นี้
├── adr/                         ← กฎที่ทุก feature ต้องตาม
├── library-notes/               ← สิ่งที่ docs ของ library แนะนำ/เตือน ตามเวอร์ชันที่ติดตั้ง
└── bugs/                        ← bug ที่ไม่อยู่ใน feature ไหน (มีเมื่อเจอครั้งแรก)
.claude/skills/{framework}-{surface}/
├── SKILL.md                     ← โครงโฟลเดอร์ + กฎห้ามละเมิดของโค้ดส่วนนั้น
└── rules/{layer}.md             ← กฎของแต่ละ layer
```

## ศัพท์

| คำ | ความหมาย |
|---|---|
| **D{n}** | decision หนึ่งข้อใน `decisions.md` |
| **ADR** | กฎระดับโปรเจคที่ feature ถัดไปต้องตาม (`docs/adr/`) |
| **seam** | จุดที่ test เช็คพฤติกรรม (route, service) ตกลงไว้ใน spec |
| **(e2e)** | พฤติกรรมที่เห็นได้บนจอเท่านั้น เช็คด้วยเครื่องมือ e2e ของโปรเจค (เช่น Playwright) |
| **Blocked by** | ticket ที่ต้องเสร็จก่อน ชี้เลขต่ำกว่าเสมอ |
| **frontier** | ticket ที่เริ่มได้ตอนนี้ |
| **prefactor** | ticket จัดโค้ดเดิมก่อน เลขแรกเสมอ |
| **conventions** | กติกาเขียนโค้ดของโปรเจค `.claude/skills/{framework}-{surface}/` |
| **persona** | ผู้ใช้สมมุติใน trial |

## แต่ละ skill ทิ้งอะไรไว้

| Skill | ไฟล์ |
|---|---|
| `warroom` | `docs/features/{slug}/` spec, decisions, flow (+ `map.md` งานใหญ่) · `docs/adr/` · `CONTEXT.md` |
| `warroom-legal` | `legal.md` |
| `warroom-tickets` | `tickets/NN-*.md` · `.claude/skills/{framework}-{surface}/` |
| `warroom-build` | code + test หนึ่ง commit ต่อใบ · `docs/library-notes/` · แถวใน `open-items.md` |
| `warroom-debug` | `bugs/{date}-{slug}.md` · แถวใน `open-items.md` |
| `warroom-trial` | `user-trials/{date}.md` · ticket ใหม่ · แถวใน `open-items.md` |

ทุก skill ที่สร้างโฟลเดอร์ใหม่ใต้ `docs/` เพิ่มแถวใน `docs/README.md`
