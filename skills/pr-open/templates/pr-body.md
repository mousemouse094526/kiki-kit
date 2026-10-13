# Template: pull request body

Copy the skeleton. Every heading stays; the screenshots section only for
UI changes. Fill from facts gathered in SKILL.md › 2 — never from guesses.
The skeleton is Thai; for an English body use the headings What changes,
Why, Changes, Deploy notes, Verified, After merge, Screenshots, and
`none` instead of `ไม่มี`.

## Template

```markdown
## เปลี่ยนอะไร

{หนึ่งหรือสองประโยค: ผู้ใช้หรือคนดูแลระบบจะเห็นอะไรต่างไปหลัง merge}

## ทำไม

{ปัญหาหนึ่งหรือสองประโยค พร้อมหลักฐาน — บรรทัด log, ticket
(`docs/features/{slug}/tickets/NN-…`), issue หรือ `D{n}`}

## สิ่งที่แก้

| ส่วน | แก้อะไร |
|---|---|
| `{app หรือ package}` | {แก้อะไรในนั้น หนึ่งบรรทัด} |

## ต้องระวังตอน deploy

- **Env:** {`OLD_NAME` → `NEW_NAME` ใน {service}; ตั้งบน {staging และ prod} ก่อน merge} — หรือ `ไม่มี`
- **Migration:** {อะไรจะรัน และย้อนกลับได้ไหม} — หรือ `ไม่มี`
- **Config:** {Dockerfile, Railway watch paths, CI, start script} — หรือ `ไม่มี`
- **Dependencies:** {เพิ่ม / ลบ} — หรือ `ไม่มี`
- **Breaking:** {route, field, export ที่ลบหรือเปลี่ยนชื่อ} — หรือ `ไม่มี`
- **ย้อนกลับ:** {revert PR นี้ และอะไรอื่นที่ต้องถอยด้วย}

## ตรวจแล้ว

- `{คำสั่ง}` — {ผ่าน พร้อมจำนวนถ้ามี}
- {สิ่งที่ลองด้วยมือ} — {เห็นอะไร}

## หลัง merge

- {ต้องเช็กอะไร ที่ไหน} — {ใคร} — หรือ `ไม่มี`

## ภาพหน้าจอ

{ก่อน / หลัง — เฉพาะงานที่เห็นบนจอ}
```
