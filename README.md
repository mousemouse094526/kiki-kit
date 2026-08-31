# kiki-kit

skill กับ agent ที่ผมเขียนเอง เก็บไว้ใน git เพื่อไม่ให้หาย และย้ายไปเครื่องใหม่ได้ง่าย

ปกติของพวกนี้อยู่ในโฟลเดอร์ `~/.claude/` ในเครื่อง — เครื่องพังหรือลง macOS ใหม่ก็หายหมด repo นี้คือสำเนาที่เอากลับมาได้

---

## มีอะไรอยู่ในนี้

### skills — ความสามารถที่สอน Claude เพิ่ม

| ชื่อ | ทำอะไร |
|---|---|
| `flow-verify` | เทียบระบบที่รันอยู่จริงกับเอกสาร flow ว่าตรงกันไหม ดูผลเทสเก่าก่อน เทสเฉพาะที่ขาด แล้วรายงาน (ไม่แก้โค้ดให้) |
| `mermaid-flow` | เขียน/แก้ไดอะแกรม Mermaid ให้อ่านรู้เรื่อง ไม่เป็นเส้นพันกัน พร้อมตรวจว่า flow ถูกต้องก่อนส่ง |
| `logo-barn` | ทำชุดโลโก้แบรนด์ครบเซ็ต — wordmark, app icon, รูปโปรไฟล์, ไฟล์ PNG, เอกสารคอนเซ็ปต์, มีทั้งธีมสว่างและมืด |

### agents — ผู้ช่วยแยกที่สั่งให้ไปทำงานเองได้

| ชื่อ | ทำอะไร |
|---|---|
| `test-runner` | เทสระบบที่รันอยู่จริง (API, back office, simulator) แล้วเขียนรายงานเป็น markdown ให้ทุกรอบ |

### evals — ชุดข้อสอบไว้วัดว่า skill ทำงานดีแค่ไหน

`evals/logo-barn/` เก็บโจทย์กับตัวให้คะแนนของ `logo-barn`

ผลที่รันออกมาจะไปกองใน `iteration-1/` ซึ่ง**ไม่เก็บเข้า git** (ใส่ `.gitignore` ไว้แล้ว) เพราะมันใหญ่หลายร้อย MB

---

## ย้ายไปเครื่องใหม่ยังไง

ยังไม่ได้ push ขึ้น GitHub — ทำครั้งแรกก่อน 1 ที:

```bash
gh repo create claude-agent-skill --private --source=. --push
```

จากนั้นที่เครื่องใหม่ เปิด Claude Code แล้วพิมพ์ 2 บรรทัดนี้:

```
/plugin marketplace add <ชื่อ-github-ของคุณ>/claude-agent-skill
/plugin install kiki-kit@kiki
```

`<ชื่อ-github-ของคุณ>` = username บน GitHub เช่นถ้า repo อยู่ที่ `github.com/kiki/claude-agent-skill` ก็พิมพ์ `kiki/claude-agent-skill`

ปิด-เปิด Claude Code ใหม่ เสร็จ

---

## แก้ skill ทีหลังยังไง

1. แก้ไฟล์ใน repo นี้
2. `git commit` แล้ว `git push`
3. ในเครื่องที่ลง plugin ไว้ พิมพ์ `/plugin update kiki-kit@kiki`

---

## ทำไมไม่เก็บพวกนี้ด้วย

ตั้งใจไม่เก็บ เพราะเป็นค่าตั้งค่าเฉพาะเครื่อง ไม่ใช่ของที่เขียนเอง และตั้งใหม่ไม่กี่นาที:

| ไฟล์ | คืออะไร |
|---|---|
| `~/.claude/settings.json` | ธีม, hook, statusline, กฎว่าคำสั่งไหนรันได้เอง |
| `~/.claude/settings.local.json` | permission เฉพาะเครื่องนี้ |
| `~/.claude/statusline.sh` | สคริปต์แถบล่างจอ |
| plugin ของคนอื่น (`caveman`, `figma`) | ลงใหม่ด้วย `/plugin install` ได้ |

---

## โครงไฟล์

```
.claude-plugin/
  marketplace.json   บอก Claude ว่า repo นี้เป็น "ร้าน" ชื่อ kiki
  plugin.json        บอกว่าในร้านมี plugin ชื่อ kiki-kit
skills/              ← ของหลัก
agents/              ← ของหลัก
evals/               ชุดวัดผล
```

2 ไฟล์ใน `.claude-plugin/` คือสิ่งที่ทำให้ Claude Code รู้จัก repo นี้ ห้ามลบ

ตรวจว่าไฟล์ยังถูกต้องไหม:

```bash
claude plugin validate .
```
