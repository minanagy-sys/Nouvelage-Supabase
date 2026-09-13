# Nouvelage — public API contract

What we need you to serve. Everything not listed here we handle on our side,
so please do not add it.

Six endpoints. JSON. Read-only except the last one.

---

## Rules

- Every object has an `id`: a stable string, **at least 3 characters**. Prefix
  numeric keys — `doc-412`, not `412`.
- **Links are by id, never by name.** A name is never accepted where an id
  belongs.
- Lists are **real JSON arrays**, never a string containing JSON.
- Timestamps carry a **UTC offset** — `2026-04-20T14:00:00+02:00`.
- Images are **paths or URLs**. Never base64, never `data:`.
- Both sides of a link must agree: if doctor D lists treatment T, then
  treatment T lists doctor D.
- Content endpoints may be cached. **Availability must be `no-store`.**

---

## 1. `GET /doctors`

```json
[{
  "id": "doc-412",
  "name": "Dr. Randa El Aguizy",
  "specialization": "Dermatology & Laser",
  "photo": "/media/doctors/randa.jpg",
  "years_experience": 14,
  "branch_ids": ["br-3", "br-7"],
  "treatment_ids": ["svc-1987", "svc-2041"],
  "active": true
}]
```

`GET /doctors/{id}` returns one.

---

## 2. `GET /categories`

```json
[{ "id": "cat-7", "name": "Injectables" }]
```

---

## 3. `GET /treatments`

```json
[{
  "id": "svc-1987",
  "name": "Lip Filler",
  "category_id": "cat-7",
  "price": 6500,
  "currency": "EGP",
  "duration_minutes": 45,
  "doctor_ids": ["doc-412", "doc-508"],
  "bookable": true,
  "active": true
}]
```

Optional filter: `?doctor_id=doc-412`

`price` must be the price you actually invoice.

---

## 4. `GET /cases`

Before/after cases.

```json
[{
  "id": "case-90210",
  "doctor_id": "doc-412",
  "treatment_ids": ["svc-1987"],
  "consent_on_file": true
}]
```

Filters: `?doctor_id=` · `?treatment_id=`

**Send only cases where `consent_on_file` is true.** We will not publish
anything without it. Do not send patient names, dates or any medical detail —
we need the link and the consent flag, nothing else. The images are ours.

---

## 5. `GET /availability`

```
GET /availability?doctor_id=doc-412&treatment_id=svc-1987&branch_id=br-3
                 &from=2026-04-20&to=2026-04-27
```

```json
[{
  "start": "2026-04-20T14:00:00+02:00",
  "end":   "2026-04-20T14:45:00+02:00",
  "branch_id": "br-3"
}]
```

**Free slots only.** Never return booked appointments — that would reveal when
a named patient attends the clinic.

Header: `Cache-Control: no-store`.

---

## 6. `POST /bookings`

```json
{
  "doctor_id": "doc-412",
  "treatment_id": "svc-1987",
  "branch_id": "br-3",
  "slot_start": "2026-04-20T14:00:00+02:00",
  "slot_end":   "2026-04-20T14:45:00+02:00",
  "name": "Mina Nagy",
  "phone": "+20...",
  "email": "name@example.com",
  "birthday": "1990-05-11",
  "notes": ""
}
```

Response:

```json
{ "booking_id": "apt-77431", "status": "confirmed" }
```

If the slot was taken in the meantime, return **409** — do not silently pick
another time.

---

## What you may need to build

1. **Doctor ↔ treatment link** (`treatment_ids` / `doctor_ids`). If the link
   does not exist yet, derive it from appointment history — past appointments
   already record which specialist performed which service.
2. **Case object** with `doctor_id`, `treatment_ids` and `consent_on_file`.
3. **Availability endpoint** returning free slots.
4. **Booking endpoint** accepting ids and a slot.

---

## Before you hand it over

```bash
node backend/scripts/validate-provider.mjs --base https://your-api/v1
```

It checks the shape and the links, and exits non-zero on any failure. A case
pointing at a doctor `/doctors` does not return, a doctor listing a treatment
`/treatments` does not have, or the two sides of a link disagreeing are all
caught here.
