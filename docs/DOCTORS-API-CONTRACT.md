# Doctor profile API contract (v1)

Everything the website reads about a doctor, and about the before/after cases
attached to them. An external API that returns exactly these objects can
replace `/api/content/doctors` with no change to the pages.

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
| `GET /cases` | `{ "cases": [Case, …] }` | All published cases; support `?doctor_id=` to filter. Does not exist yet in any form. |

## 2. Conventions

These match how the site already parses the payload; breaking one means
changing application code.

- **snake_case keys**, exactly as spelled below.
- **Real JSON arrays** for the eight array fields — `["English","Arabic"]`,
  never a string containing JSON. This is the most common way this payload
  arrives broken.
- **Never `null` for an array** — send `[]`. The pages iterate without null guards.
- **Numbers as numbers** (`13`, `4.9`), **booleans as booleans** (not `1`/`0`).
- **ISO 8601 UTC timestamps** (`2026-03-14T09:41:00Z`).
- **Errors**: `{ "error": "human readable message" }` with a real status code,
  no internals in the body.
- **Caching**: send `ETag` and `Cache-Control`. The site caches content reads
  for 60s, so the API sees ~1 request/minute per list regardless of traffic.
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
| `services` | string[] | yes | `["Botox","Dermal Fillers","Thread Lift"]` — see decision 3. |
| `branches` | string[] | yes | `["CFC","City Stars","Mall Of Arabia"]` — short labels today, see decision 3. |
| `available_days` | string[] | yes | Often empty; send `[]`. |

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
| `bodypart` | string | yes | `"Lips"`. Filter facet — vocabulary in §5. |
| `material` | string | yes | `"Filler (HA)"`. What was used. |
| `effect` | string | yes | `"Volume"`. What it achieved. |
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

3. **Are `services` and `branches` free text or references?** They are loose
   strings today — `"City Stars"`, `"Madinty The Strip"` (misspelled) — which
   don't match the full branch names used elsewhere. Either keep free text and
   accept the mismatch, or return `branch_ids` / `service_ids` alongside the
   labels so a doctor links to a real branch and treatment page.

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
