# Doctor profile API contract (v3)

Everything the website reads about a doctor, the before/after cases attached to
them, and the two things the booking form needs from outside: the treatment list
and the doctor's real availability. An external API that returns exactly these
objects can replace `/api/content/doctors` with no change to the pages.

Field names, types and lengths come from the `doctors` table
(`backend/db/schema.sql`) and the writable field registry
(`backend/src/admin/resources.js`). Example values and the vocabulary counts
come from real production data: 51 doctor records and 210 before/after cases.

A formatted, shareable copy of this document is published at
<https://claude.ai/code/artifact/1fdaaabb-51f8-4c11-98e9-beb7c0972c06>.
This file is authoritative if the two ever differ.

## 1. Endpoints

Public, unauthenticated, `GET` only. The envelope key matters — the site reads
`response.doctors` and `response.doctor` directly.

| Method & path | Returns | Rules |
|---|---|---|
| `GET /doctors` | `{ "doctors": [Doctor, …] }` | Only `is_active` records, ordered by `order_index` ASC. Full objects — the team page renders qualifications and ratings from this list. |
| `GET /doctors/{idOrSlug}` | `{ "doctor": Doctor }` | Accepts the `id` **or** the `slug` in the same segment. `404` + `{"error":"Doctor not found"}` when missing or inactive. |
| `GET /cases` | `{ "cases": [Case, …] }` | Support `?doctor_id=`, `?treatment_id=`, and both together — the profile filters by doctor, the service modal by treatment. Does not exist yet in any form. |
| `GET /treatments` | `{ "treatments": [Treatment, …] }` | Feeds the booking form's treatment list. Support `?doctor_id=` and `?branch_id=`. See §7. |
| `GET /doctors/{id}/availability` | `{ "timezone": …, "days": [Day, …] }` | Bookable slots. Takes `treatment_id`, `branch_id`, `from`, `to`. Never cached. See §8. |
| `POST /holds` | `{ "hold": Hold }` | Reserves a slot ~10 min while the visitor fills the form. See §9. |
| `POST /bookings` | `{ "booking": Booking }` | Confirms the hold into an appointment. Idempotent. See §9. |

## 2. Conventions

These match how the site already parses the payload; breaking one means
changing application code.

- **snake_case keys**, exactly as spelled below.
- **Real JSON arrays** for the eight array fields — `["English","Arabic"]`,
  never a string containing JSON. This is the most common way this payload
  arrives broken.
- **Never `null` for an array** — send `[]`. The pages iterate without null guards.
- **Numbers as numbers** (`13`, `4.9`), **booleans as booleans** (not `1`/`0`).
- **ISO 8601 timestamps including the offset** (`2026-04-12T14:30:00+03:00`).
  Critical for appointments — a bare local time gets booked in the wrong hour.
- **Errors**: `{ "error": "human readable message" }` with a real status code,
  no internals in the body.
- **Caching**: content endpoints send `ETag` and `Cache-Control` (the site
  caches them 60s, so the API sees ~1 request/minute per list regardless of
  traffic). Availability and bookings send `Cache-Control: no-store` — a
  minute-old slot list produces double bookings.
- **CORS** for the clinic origins; no credentials needed.
- **No pagination by default.** 51 doctors and 210 cases fit one response. If
  paging is added, keep the unpaginated default — the team page needs all
  doctors at once.

## 3. The Doctor object (31 fields)

### Identity

| Field | Type | Req | Example / notes |
|---|---|---|---|
| `id` | string | yes | UUID. Stable forever, never reused — pages store these to select doctors. |
| `slug` | string | yes | Unique, lowercase, hyphenated: `randa-el-aguizy`. This is the public URL; changing one breaks live links. |
| `name` | string(200) | yes | `"Dr. Randa El Aguizy"` — display name including honorific. |
| `title` | string(50) | no | `"Dr."` |
| `specialization` | string(200) | no | `"Derma Consultant"` — shown under the name. |
| `sub_specialties` | string[] | yes | `["All services except laser hair removal"]`. Often empty. |
| `gender` | `"male"`\|`"female"` | no | Filters doctors for the For Her / For Him pages. |

### Credentials and practice

| Field | Type | Req | Example / notes |
|---|---|---|---|
| `qualifications` | string[] | yes | `["MD","Board Certified Dermatologist"]` |
| `certificates` | string[] | yes | `["Licensed · Egyptian Medical Syndicate"]` |
| `experience` | integer | yes | `13` whole years, default `0`. Drives "YEARS EXP." on every card. |
| `rating` | number | yes | `4.9` (0.00–5.00, 2 dp), default `0`. Drives the star display. |
| `languages` | string[] | yes | `["English","Arabic"]` |
| `treatment_ids` | string[] | yes | **The canonical link.** Treatment ids this doctor performs — the same ids `/treatments` returns. Nothing else decides which treatments belong to a doctor. |
| `services` | string[] | yes | **Derived, never authored.** Display names of `treatment_ids`, same order, so the profile can render chips and the count without a second request. Names only — the site currently receives a mix of names and UUIDs here and sniffs which with a regex. |
| `branches` | object[] | yes | **Objects, not name strings:** `[{"id":"br_citystars","slug":"citystars","name":"Citystars — Phase 2"}]`. The form needs `id` to ask for availability; a bare `"City Stars"` cannot make that call. |
| `available_days` | string[] | yes | Coarse day names for display only, **derived from the schedule** — never authored separately. Not the booking calendar (§11). |

### Written content

| Field | Type | Req | Notes |
|---|---|---|---|
| `bio` | text | no | Short tagline for the profile header. |
| `long_bio` | text | no | Full biography. Plain text with newlines, not HTML. (The dashboard labels this "About".) |
| `philosophy` | text | no | The doctor's approach to care. |

### Media, display and SEO

| Field | Type | Req | Notes |
|---|---|---|---|
| `profile_image` | string(500) | yes | Path or URL. Never bytes — see §6. |
| `before_after_gallery` | object[] | yes | The doctor's own cases; shape in §4A. |
| `featured` | boolean | yes | Highlights the doctor in featured strips. |
| `is_active` | boolean | yes | Inactive doctors must be **excluded** from public responses, not just flagged. |
| `order_index` | integer | yes | Manual display order, ascending. Editors reorder by hand, so this must be stored, not derived. |
| `meta_title` | string(200) | no | Tab and search-result title. |
| `meta_description` | text | no | Search snippet. |
| `meta_keywords` | text | no | Comma-separated. Legacy, kept for parity. |
| `instagram_url` | string(200) | no | Full URL. |
| `facebook_url` | string(200) | no | Full URL. |
| `linkedin_url` | string(200) | no | Full URL. |
| `created_at` | timestamp | yes | ISO 8601 UTC. |
| `updated_at` | timestamp | yes | ISO 8601 UTC. Useful for cache validation. |

> **Three fields the profile page shows that no column holds today.**
> The doctor detail page renders `treatments` (`[{name, description}]`),
> `expertise` (`string[]`) and `booking_link`. They currently come from a file
> bundled with the site, which is why nobody can edit them. See decision 1.

## 4. Before/after cases

**Where today's 210 cases come from.** They are not in the database and were
never entered through the dashboard. They sit in a file shipped with the
website, `frontend/src/assets/cases-data.json` (75 KB), with 572 image files
(15 MB) under `frontend/public/assets/img/media-library/doctors/<slug>/cases/`,
covering 15 doctors. They arrived with the original site build. That is why
nobody can edit or remove them from the dashboard, and why moving them into a
real API is worth doing.

Two shapes exist. Implement **both**: the nested gallery keeps the profile page
working unchanged, the flat record is what the treatment pages filter on.

### 4A. Nested — `before_after_gallery[]`

| Field | Type | Req | Example |
|---|---|---|---|
| `before` | string | yes | `/assets/img/media-library/doctors/randa-el-aguizy/cases/case-1-before.webp` |
| `after` | string | yes | `…/case-1-after.webp` |
| `description` | string | yes | `"Fillers full face"` |
| `procedure` | string | yes | `"Filler (HA)"` |
| `category` | string | no | `face` · `skin` · `hair` · `body` · `laser` |

### 4B. Flat record — `GET /cases`

210 of these in production across 16 doctors.

| Field | Type | Req | Example / notes |
|---|---|---|---|
| `id` | string | yes | `"f707bc244"` |
| `doctor_id` | string | yes | The doctor's `id`. **Not the name** — see decision 2. |
| `doctor_slug` | string | yes | So a case links to a profile without a second request. |
| `treatment_id` | string | yes | **What was actually done**, as a treatment id. This is what lets a service's gallery show only cases of *that* treatment. Without it the gallery filters by doctor alone, which is why a doctor's Botox case currently appears under a laser service. |
| `treatment_ids` | string[] | no | For a combined case (fillers *and* Botox in one sitting). Include `treatment_id` among them. |
| `bodypart` | string | yes | `"Lips"`. Filter facet — vocabulary in §5. |
| `material` | string | yes | `"Filler (HA)"`. What was used. |
| `effect` | string | yes | `"Volume"`. What it achieved; the gallery card title. |
| `category` | string | yes | Drives the gallery filter buttons. Absent today, so every card reads "SKIN". |
| `desc` | string | yes | `"skin booster"`. Caption under the pair. |
| `before` | string\|null | yes | Some existing rows are empty; nullable, and the site skips incomplete pairs. |
| `after` | string\|null | yes | As above. |
| `date` | timestamp | no | Currently epoch ms in the data — send ISO 8601 instead. |

## 5. Case vocabulary actually in use

Real values across the 210 live cases, with counts. New values are allowed (the
filters are built from the data), but reusing these spellings keeps existing
filters intact.

**bodypart** (13 distinct): Lips 51 · Face 31 · Laser hair removal 26 ·
Forehead 21 · Body 19 · Hair / Scalp 17 · Full face 12 · Chin / Jawline 9 ·
Acne scars (face) 8 · Gummy smile 7 · Neck 4 · Crow's feet 3

**material** (24 distinct, most frequent): Filler (HA) 72 · Botox 31 ·
Laser Hair Removal (DEKA) 26 · Nutrition + Onda 16 · Device — Fractional/RF 8 ·
Black-head extraction 7 · OxyGeneo facial 7 · Stem cells — hair 7 · Peeling 4 ·
Biostimulator 4 · Neck treatment 4 · Exocel (Exosomes) 4

**effect** (13 distinct): Volume 70 · Hair removal 26 · Wrinkle reduction 24 ·
Hydration & glow 18 · Hair growth 17 · Fat reduction / Contouring 16 ·
Lift & tightening 13 · Scar / texture 10 · Gummy smile 7 · Brightening 4 ·
Under-eye 2 · Fat reduction 2

> **Two of these are the same thing.** `Fat reduction / Contouring` (16) and
> `Fat reduction` (2) both exist, producing two filter chips for one outcome.
> Merge during import rather than carrying the duplicate forward.

## 6. Image rules

Non-negotiable — the site was rebuilt specifically to get image bytes out of
the data layer.

- **Paths only.** Never base64, data URIs or binary in JSON. Either a
  root-relative path (`/assets/img/…`) or a full `https://` URL, applied
  consistently.
- **WebP preferred** at quality ~80; JPEG/PNG accepted (the server negotiates
  a smaller format where one exists).
- **Sensible dimensions**: portraits ~1200px long edge, case photos ~1600px.
- **Matched pairs**: a before and its after share dimensions, crop and
  lighting, or the comparison misleads the viewer.
- **Stable URLs**: write a new file rather than replacing bytes under an
  existing name — images are cached for 30 days.
- **Patient consent**: only publish cases with documented consent and no
  identifying detail beyond the treated area.

## 7. Four things to confirm before building

1. **Do you own `treatments`, `expertise` and `booking_link`?** The profile
   page displays all three but no column stores them. If yes, add
   `treatments: [{name, description}]`, `expertise: string[]`,
   `booking_link: string` to the Doctor object.

2. **Cases must key on `doctor_id`, not the doctor's name.** Today a case says
   `"doctor": "Dr. Nourhan Ashraf"` and the site translates it through a
   hardcoded list of 15 names, so a doctor not on that list shows no cases and
   a spelling fix silently detaches their gallery. Confirm every case carries
   `doctor_id` and `doctor_slug`, and that the import maps all 16 existing
   names onto real records.

3. **Mapping today's loose strings onto ids.** The chain (§8) requires ids, so
   this is no longer optional — the question is only how the existing text
   becomes them. Branches are stored as `"City Stars"`, `"Madinty The Strip"`
   (misspelled), and `doctor.services` holds a mix of names and UUIDs. Send us
   the branch list with ids, and confirm how the doctor → treatment links get
   seeded: from `doctor.services`, from the `specialist_doctor_ids` already on
   each service, or reviewed by the clinic.

4. **Who hosts the images?** The paths above point at the clinic's own server.
   If the API hosts them instead, every path becomes an absolute URL on that
   domain, which then needs long-lived caching and permissive CORS for images.
   This decides whether existing stored paths stay valid.

## 8. Complete example

```
GET /doctors/randa-el-aguizy
```
```json
{
  "doctor": {
    "id": "b7f1c8e2-4a2c-4f19-9d3e-1a5c7b904e11",
    "slug": "randa-el-aguizy",
    "name": "Dr. Randa El Aguizy",
    "title": "Dr.",
    "specialization": "Derma Consultant",
    "sub_specialties": ["All services except laser hair removal"],
    "qualifications": ["MD", "Board Certified Dermatologist"],
    "certificates": [
      "Licensed · Egyptian Medical Syndicate",
      "International certification in aesthetic medicine"
    ],
    "experience": 13,
    "rating": 4.9,
    "languages": ["English", "Arabic"],
    "services": ["Botox", "Dermal Fillers", "Thread Lift", "HydraFacial"],
    "branches": ["CFC", "City Stars", "Mall Of Arabia", "Nouvelage HQ"],
    "available_days": [],
    "gender": "female",
    "profile_image": "/assets/img/doctors/randa-el-aguizy.webp",
    "before_after_gallery": [
      {
        "before": "/assets/img/doctors/randa-el-aguizy/cases/case-1-before.webp",
        "after": "/assets/img/doctors/randa-el-aguizy/cases/case-1-after.webp",
        "description": "Fillers full face",
        "procedure": "Filler (HA)",
        "category": "face"
      }
    ],
    "bio": "Thirteen years shaping natural, balanced results.",
    "long_bio": "Dr. Randa El Aguizy is a dermatology consultant …",
    "philosophy": "Restore, never redesign.",
    "featured": true,
    "is_active": true,
    "order_index": 1,
    "meta_title": "Dr. Randa El Aguizy — Derma Consultant | Nouvelage",
    "meta_description": "Board-certified dermatologist in Cairo …",
    "meta_keywords": "dermatologist cairo, fillers, botox",
    "instagram_url": "https://instagram.com/…",
    "facebook_url": null,
    "linkedin_url": null,
    "created_at": "2025-11-02T08:15:00Z",
    "updated_at": "2026-03-14T09:41:00Z"
  }
}
```

```
GET /cases?doctor_id=b7f1c8e2-4a2c-4f19-9d3e-1a5c7b904e11
```
```json
{
  "cases": [
    {
      "id": "f707bc244",
      "doctor_id": "b7f1c8e2-4a2c-4f19-9d3e-1a5c7b904e11",
      "doctor_slug": "randa-el-aguizy",
      "bodypart": "Full face",
      "material": "Filler (HA)",
      "effect": "Volume",
      "desc": "Fillers full face",
      "before": "/assets/img/doctors/randa-el-aguizy/cases/case-1-before.webp",
      "after": "/assets/img/doctors/randa-el-aguizy/cases/case-1-after.webp",
      "date": "2024-05-29T00:00:00Z"
    }
  ]
}
```

## 8. The chain: one id from profile to booked appointment

Every screen after the first depends on an id handed to it by the one before.
Two rules make it hold: **one id identifies a thing everywhere**, and **one
endpoint owns each fact**. Nothing is matched by name; nothing is stored twice.

1. **Visitor opens a profile** — `GET /doctors/randa-el-aguizy`.
   The slug is in the URL; the response carries the doctor's `id`. From here on
   that id, never the name, identifies this doctor.
   → carries `doctor.id`, `doctor.treatment_ids`, `doctor.branches[].id`

2. **Profile lists this doctor's treatments** — `GET /treatments?doctor_id={id}`.
   The "Treatments" block renders this response. Not a name lookup, not a second
   copy embedded in the doctor record.
   → carries `treatment.id`, `name`, `duration_minutes`, `price`

3. **A service's gallery shows cases of that treatment** —
   `GET /cases?treatment_id={id}`. The before/after gallery inside a service
   popup asks by *treatment*, so it shows work of the treatment being read
   about. Add `&doctor_id=` to narrow to one specialist; each card still links
   back to the doctor via `doctor_slug`.
   → carries `case.before`/`after`, `effect`, `bodypart`, `doctor_slug`

4. **Booking form fills its treatment dropdown** — *the same call as step 2*,
   identical doctor id, so the options can never differ from what the profile
   showed. Label `treatment.name`, value `treatment.id`.
   → visitor picks `treatment_id`

5. **Branch dropdown** — from `doctor.branches[]`; label `.name`, value `.id`.
   If a treatment is offered at fewer branches than the doctor works at,
   intersect with `treatment.branch_ids`.
   → visitor picks `branch_id`

6. **Dates and times** —
   `GET /doctors/{id}/availability?treatment_id=&branch_id=&from=&to=`.
   All three ids go in, so the answer is specific to *this doctor, this
   treatment, at this branch*: slot length from the treatment's
   `duration_minutes`, hours from that doctor's schedule at that branch. The
   picker greys out `full`/`closed`/`holiday`; the time dropdown lists that
   day's `slots[]`. Refetched on any change of treatment, branch or date.
   → visitor picks `slot_id`

7. **Hold it** — `POST /holds` with the four ids, the moment a time is picked
   and before any typing. Returns a `hold_id` good ~10 minutes.
   → carries `hold_id`, `expires_at`

8. **Confirm** — `POST /bookings` with the same ids plus `hold_id`, the
   patient's details and an `idempotency_key`.
   → carries `booking_reference`, `appointment_start`, `appointment_end`

### The five rules that keep it single-source

| Fact | Owned by | Never |
|---|---|---|
| Which doctor | `doctor.id` | Matched by `name`. Names get corrected; ids do not. |
| Which treatments a doctor performs | `doctor.treatment_ids` ⇄ `treatment.doctor_ids` | Two hand-maintained lists. Store one edge, generate the other. |
| Treatment name, price, duration | `GET /treatments` | Duplicated into the doctor record, or hardcoded in the form. |
| What a before/after case shows | `case.doctor_id` + `case.treatment_id` | Inferred from the free-text `material`. A case belongs to a doctor *and* a treatment. |
| When a doctor is free | `GET …/availability` | Derived on the website from `available_days` or opening hours. The site displays slots; it never calculates them. |

**Why the website must not compute availability.** The moment it does, two
systems believe they know the schedule, and the one the visitor sees is always
the stale one. Ask, render, book — that is the whole responsibility of the form.

## 9. The doctor page, element by element

Every visible element on a doctor's profile and the field that feeds it. A
fallback is a placeholder, not content — treat "if empty" as a warning.

### Hero

| Element | Field | If empty |
|---|---|---|
| Portrait | `profile_image` | Broken image — always send one. |
| Specialisation over portrait | `specialization` | Blank strip. |
| Name (h1) | `name` | Renders empty; required. |
| Degree line | `specialization` | Blank. |
| Tagline | `bio` | Falls back to `long_bio`, then a generic sentence. |
| Stat 1 "YEARS EXP." | `experience` | Shows `0+`. |
| Stat 2 rating | `rating` | Shows `★4.9` — a hardcoded placeholder. Send a real value. |
| Stat 3 treatment count | `services.length` | Shows 0. |
| "Available at" branch chips | `branches` | Whole row hidden. |
| Book button | `booking_link` *(missing)* | See decision 1. |

### Body

| Element | Field | If empty |
|---|---|---|
| "About {firstName}" paragraph | `long_bio` | Empty block; heading still renders. |
| Treatments list (name + description) | `treatments[]` *(missing)* | Falls back to `services[]` with a generic description. Decision 1. |
| Certificates list | `certificates` | Block hidden. |
| Languages chips | `languages` | Block hidden. |
| Consultations card | `philosophy` | Block hidden. |

### Results gallery

| Element | Field | Notes |
|---|---|---|
| "Real results from {firstName}" | `name` | First name derived from `name`. |
| Category filter buttons | `case.category` | Built from the doctor's cases; hidden when none. |
| Before image + label | `case.before` | Card skipped if either side missing. |
| After image + label | `case.after` | As above. |
| "Case n · CATEGORY" | `case.category` | Falls back to the literal `SKIN`. |
| Card title | `case.effect` | Falls back to `case.bodypart`. |
| Card subtitle | `case.bodypart` | Hidden when absent. |
| Product chips | `case.material` | Hidden when absent. |
| "See More Cases" | — | Appears past four cases. |

### Booking block

| Element | Fed by | Notes |
|---|---|---|
| "Book with {name}" | `name` | — |
| Treatment select | `GET /treatments?doctor_id=` | §7. Hardcoded today. |
| Branch select | `doctor.branches` | Should become branch ids — decision 3. |
| Date picker | `GET /doctors/{id}/availability` | §8. Only dates with a free slot selectable. |
| Time select | `availability.days[].slots[]` | §8. Refetched on treatment/branch/date change. |
| Name / phone / email / message | visitor input | Posted in §9. |
| Submit | `POST /holds` → `POST /bookings` | §9. |

## 10. Treatments for the booking form

The treatment decides how long the appointment is, and therefore which slots can
be offered. Today the list is hardcoded in the page.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | yes | What `POST /bookings` sends back as `treatment_id`. |
| `slug` | string | yes | `"laser-hair-removal"` — links the form to the treatment page. |
| `name` | string | yes | The option label. |
| `category` | string | no | Groups options: Face · Skin · Hair · Body · Laser. |
| `duration_minutes` | integer | yes | **An integer, in minutes.** The site's current `duration` is free text ("45 min", "1 hour") and cannot compute an end time. |
| `buffer_minutes` | integer | no | Cleaning / turnaround after the appointment. |
| `price` | number\|null | no | Numeric. Null when price is on consultation. |
| `currency` | string | no | `"EGP"` |
| `price_from` | boolean | no | True when the price is a starting figure. |
| `requires_consultation` | boolean | no | True when it cannot be booked directly. |
| `doctor_ids` | string[] | yes | Which doctors perform it — the same relationship as `doctor.treatment_ids` seen from this side. Store one edge, generate the other so they cannot disagree. |
| `branch_ids` | string[] | yes | Where it is offered; some devices exist at one branch only. |
| `is_active` | boolean | yes | Inactive treatments must not be returned at all. |

## 11. Availability and the doctor's schedule

The website must never compute availability itself. It asks for free slots and
renders exactly what comes back, so the schedule stays in one place and the site
cannot offer a time that is already taken.

**Request** — all required: `treatment_id` (decides slot length), `branch_id`
(a doctor works different days at different branches), `from`, `to` (cap the
span you accept, e.g. 31 days, and say so in the error).

**Response**

| Field | Type | Notes |
|---|---|---|
| `timezone` | string | `"Africa/Cairo"` — an IANA name, not an offset. Egypt observes DST, so a fixed +02:00 breaks twice a year. |
| `generated_at` | timestamp | Lets the form warn that slots may be stale. |
| `slot_minutes` | integer | Grid the slots sit on, e.g. 15 or 30. |
| `min_notice_minutes` | integer | How soon an appointment may start. |
| `days[]` | object[] | One entry per date **including full and closed days** — the picker greys them out rather than hiding them. |
| `days[].date` | date | `"2026-04-12"` |
| `days[].status` | string | `open` · `full` · `closed` · `holiday` |
| `days[].note` | string\|null | `"Eid holiday"` — shown on the greyed-out date. |
| `days[].slots[]` | object[] | Bookable starts only. Empty for a full or closed day. |
| `slots[].start` | timestamp | `"2026-04-12T14:30:00+03:00"` — with offset. |
| `slots[].end` | timestamp | Start + duration + buffer, computed by you. |
| `slots[].slot_id` | string | Opaque token, passed straight back when holding and booking. |

**Return only free slots, never busy ones.** Listing taken appointments — even
without names — leaks how busy a clinic is and when a specific patient attends.
Availability is patient data.

Rules: `Cache-Control: no-store`; aim under 300ms (the visitor is waiting on a
date change); a day with no slots is `status: full`/`closed`, never an error;
every timestamp carries its offset and the site never converts; rate-limit by IP
and return `429` with `Retry-After`.

## 12. Creating a booking

Two steps, because a web form takes minutes to fill and the slot must not vanish
underneath the visitor, nor be held forever if they abandon it.

**Step 1 — `POST /holds`**, called the moment a time is chosen. Send
`doctor_id`, `treatment_id`, `branch_id`, `slot_id`. Returns `hold_id` and
`expires_at` (~10 minutes). Return `409 {"error":"That time was just taken"}` if
the slot went while the page was open; the form refetches and asks again.

**Step 2 — `POST /bookings`**

| Field | Type | Req | Notes |
|---|---|---|---|
| `hold_id` | string | yes | From step 1. Expired holds return `410`. |
| `doctor_id` | string | yes | Re-sent so you can verify it matches the hold. |
| `treatment_id` | string | yes | — |
| `branch_id` | string | yes | — |
| `slot_id` | string | yes | — |
| `name` | string(200) | yes | Patient's full name. |
| `phone` | string(50) | yes | The clinic's primary channel. Validate format, echo back normalised. |
| `email` | string(200) | no | Many patients book with a phone only. |
| `birthday` | date\|null | no | Collected today; keep only if the clinic needs it. |
| `message` | text | no | Free text from the visitor. |
| `source` | string | yes | `"website-doctor-page"` — so the clinic sees where bookings come from. |
| `idempotency_key` | string | yes | One per submission. A repeat with the same key returns the **same** booking — this is what stops a double-tap creating two appointments. |

**Response**: `id`, a human `booking_reference` the patient can quote,
`status` (`confirmed` or `pending`), `appointment_start` / `appointment_end`
with offset, and the doctor, treatment and branch names for the confirmation
screen. Add `GET /bookings/{id}` so the thank-you page can be reloaded.

The two failures the form must handle:
`409 {"error":"That time was just taken"}` → refetch slots and ask again;
`410 {"error":"Your hold expired"}` → re-hold the same slot.

**The site cannot store appointments today.** Its `bookings` table has no date
or time column at all, and records doctor, treatment and branch as loose text.
Appointments therefore live in the external system and the website keeps only a
reference — the right split anyway, since clinic staff work in that calendar,
not in the website dashboard.

## 13. Two more things to confirm

5. **Who confirms an appointment — the provider or the clinic?** It decides
   whether `POST /bookings` returns `confirmed` or `pending`, and whether the
   patient is confirmed immediately or after a staff call. Also confirm who
   sends the confirmation and on which channel — the clinic runs on WhatsApp.

6. **Can a patient cancel or reschedule from the website?** Out of scope above.
   If yes it needs two more endpoints and a token emailed to the patient,
   because a booking id in a URL is guessable and would expose other people's
   appointments.
