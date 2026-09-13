# What we need from the external API

Extracted from the site's own code — every field below is consumed by a
specific element on a specific page. Nothing here is aspirational: if a field
is listed, something on screen renders it today or has a placeholder waiting
for it.

**Source** says who owns the value:

- **EXT** — the external system must serve it. It is operational truth
  (identity, price, schedule, who does what) and the site must never hold a
  second copy.
- **OURS** — we write it in the dashboard. It is editorial (copy, layout,
  images, ordering, SEO) and no clinical system has a field for it.

Fields marked EXT that do not exist in the external system yet are flagged
**(to create)** — those are the ones to build.

---

## 0. Why every join must use an id

The site currently matches doctors by their display name. Two hardcoded
lists exist, and they already disagree:

| List | Where | Count |
|---|---|---|
| Booking form dropdown | `frontend/src/app/components/contact/contact.component.html:146` | 14 names |
| Before/after case map | `frontend/src/app/components/services/cases.service.ts:29` | 15 names |

**Only 5 of the 14 match exactly.** `Dr. Randa EL Aguizy` and
`Dr. Randa El Aguizy` differ by one capital letter; `Dr. Nourhan Ashraf Gouda`
and `Dr. Nourhan Ashraf` are the same person written two ways. Every mismatch
is a doctor whose cases never appear on her own profile.

So: **every object carries a stable `id`, and every link is by `id`, never by
name.** Ids must be at least 3 characters — prefix numeric keys
(`doc-412`, `svc-1987`, `cat-7`), because bare `7` fails our validator
(`docs/openapi/nouvelage-doctors-api.yaml:391`).

---

## 1. Doctor

Rendered on the doctors grid (`team.component.html`) and the profile page
(`doctor-detail.component.html`).

| Field | Type | Source | Where it renders |
|---|---|---|---|
| `id` | string | EXT | joins for cases, treatments, availability, booking |
| `slug` | string | OURS | profile URL `/doctors/{slug}` |
| `name` | string | EXT | card title, profile hero, booking dropdown |
| `specialization` | string | EXT | card subtitle + profile role line |
| `photo` | image path | EXT | card avatar, profile hero, popup specialist row |
| `years_experience` | int | EXT | card "YEARS EXP." stat, profile stat |
| `branch_ids` | string[] | EXT | profile "Branches" list |
| `treatment_ids` | string[] | EXT **(to create)** | profile services grid, popup specialist list, booking dropdown |
| `active` | bool | EXT | hide a doctor who has left |
| `certificates` | string[] | OURS | profile "Certificates" list |
| `languages` | string[] | OURS | profile "Languages" list |
| `bio` | string | OURS | card one-liner + profile hero line |
| `about` | string | OURS | profile "About" paragraph |
| `rating` | number 0–5 | OURS | card "RATING" stat, profile ★ badge |
| `featured`, `order` | bool, int | OURS | which doctors show first |
| `meta_title`, `meta_description` | string | OURS | profile SEO |

**The one to build:** `treatment_ids`. Today the external link is
doctor → *department*, not doctor → *treatment*. If the module is not ready,
derive it from appointment history — every past appointment already records
which specialist performed which service, so "what does this doctor do" is
computable now without waiting.

That single field drives three screens at once: the profile's service grid,
the service popup's specialist list, and the booking form's treatment
dropdown. Get it right and the whole chain is consistent by construction.

---

## 2. Category (the services-page filters)

The filter row at `services.component.html:588` is built by collecting
distinct `parent_service` strings off the services themselves
(`services.component.ts:107`). There is no category object, so the filters
have no fixed order, no image, and no stable id.

| Field | Type | Source | Where it renders |
|---|---|---|---|
| `id` | string | EXT | what a treatment points at |
| `name` | string | EXT | filter chip label |
| `is_public` | bool | OURS | not every internal category belongs on the site |
| `order` | int | OURS | left-to-right order of the chips |
| `hero_image`, `description` | image path, string | OURS | category header |

We need the **list with ids**. Which of them appear as filters, and in what
order, stays ours.

---

## 3. Treatment (the sub-service — the thing added to cart)

The card in the grid and the popup at `services.component.ts:700-760`.

| Field | Type | Source | Where it renders |
|---|---|---|---|
| `id` | string | EXT | cart line, booking, case join, doctor join |
| `name` | string | EXT | card title, booking dropdown, popup heading |
| `category_id` | string | EXT | which filter chip the card sits under |
| `price` | number | EXT | card price + popup "Investment" — must equal the invoice |
| `currency` | string | EXT | price unit |
| `duration_minutes` | int | EXT | popup meta strip "Duration", and slot length |
| `doctor_ids` | string[] | EXT **(to create)** | popup "06 — Specialist" |
| `bookable` | bool | EXT | can it be booked online at all |
| `active` | bool | EXT | withdrawn treatments disappear |
| `slug` | string | OURS | URL |
| `card_image`, `card_ribbon`, `card_number`, `card_description` | | OURS | grid card |
| `detail_title`, `detail_subtitle`, `detail_tagline`, `hero_background_image` | | OURS | popup header |
| `meta_downtime`, `meta_lasts`, `meta_sessions` | string | OURS | popup meta strip (the other three) |
| `how_it_works_steps` | list | OURS | popup "01 — How" |
| `timeline` | list | OURS | popup "02 — Timeline" |
| `what_you_achieve` | list | OURS | popup "03 — Results" |
| `products_used` | list | OURS | popup "04 — Products" |
| `price_details`, `cta_button_text`, `whatsapp_number` | string | OURS | popup footer |
| `show_in_grid`, `show_price`, `order` | | OURS | merchandising |

`doctor_ids` is the mirror of the doctor's `treatment_ids` — **the same link
read from the other side.** Both endpoints must agree; our checker
(`backend/scripts/validate-provider.mjs`) fails the build if they don't.

---

## 4. Before/after case

No case entity exists on either side yet — today the gallery reads a static
`assets/cases-data.json` matched by doctor name. This object has to be
created.

| Field | Type | Source | Where it renders |
|---|---|---|---|
| `id` | string | EXT **(to create)** | identity |
| `doctor_id` | string | EXT **(to create)** | profile gallery, popup gallery |
| `treatment_ids` | string[] | EXT **(to create)** | popup gallery filtered to that treatment |
| `consent_on_file` | bool | EXT **(to create)** | **nothing publishes without this** |
| `category` | enum | OURS | profile gallery filter chips (face · skin · hair · body · laser · machines) |
| `bodypart` | string | OURS | case card title |
| `material` | string | OURS | case card product chip |
| `effect` | string | OURS | case card subtitle |
| `caption` | string | OURS | popup gallery caption — the only text there |
| `before_image`, `after_image` | image path | OURS | the two halves of the slider |
| `published` | bool | OURS | the dashboard tick that puts it live |
| `order` | int | OURS | gallery order |

Two gates, both required, in this order:

1. **`consent_on_file` from the external system** — the legal record that the
   patient agreed to marketing use. The dashboard must refuse to publish a
   case without it.
2. **`published` on our side** — the editorial decision that it is ready.

`category` is currently *guessed* from the bodypart string
(`cases.service.ts:48`), which is why every card reads "SKIN". It has to
become a real stored value.

Image files stay on our disk through the existing media pipeline (WebP +
480/768/1200 variants, paths in the database, never bytes). We need the
**link and the consent flag** from outside, not the pictures.

---

## 5. Availability (booking date and time)

**The booking form has no date or time field at all today** — it collects
branch, doctor and treatment as free text and sends them off
(`bookings.service.ts:27-38`). This is the largest single gap.

`GET /availability?doctor_id=&treatment_id=&branch_id=&from=&to=`

| Field | Type | Source | Notes |
|---|---|---|---|
| `start` | timestamp | EXT | must carry a UTC offset (`Z` or `+02:00`) |
| `end` | timestamp | EXT | after `start` |
| `branch_id` | string | EXT | which branch this slot is at |

**Free slots only.** Returning taken appointments would leak when a named
patient attends the clinic. Response must be `Cache-Control: no-store` — a
cached slot list sells the same appointment twice.

---

## 6. Booking (write)

`POST /bookings` — everything by id, plus the chosen slot:

```
doctor_id · treatment_id · branch_id · slot_start · slot_end
name · phone · email · birthday · notes
```

Response: the external booking reference, so our dashboard and theirs are
looking at the same appointment.

The site keeps its own `bookings` row as well, with the cart snapshotted at
purchase time (`bookings.items`) — a historical order must not change when a
price does.

---

## 7. Summary of what has to be created

| # | What | Who builds it |
|---|---|---|
| 1 | `doctor ↔ treatment` link, both directions | External — or derived from appointment history as an interim |
| 2 | Case object with `doctor_id` + `treatment_ids` | External (the link) |
| 3 | `consent_on_file` per case | External |
| 4 | Category ids exposed on treatments | External |
| 5 | Free-slot availability endpoint | External |
| 6 | Booking POST by id, with slot | External |
| 7 | Case media + `published` flag + category/bodypart/material/effect | Ours |
| 8 | Date/time picker in the booking form | Ours |
| 9 | Category order + which are public | Ours |
| 10 | `external_id` columns on `doctors`, `services`, `branches` | Ours |

---

## 8. Rules the API must follow

- Every list is a **real JSON array**, never a JSON-encoded string.
- Every timestamp carries a **UTC offset**.
- Image fields are **paths or URLs** — never base64, never data URIs.
- Ids are **opaque and stable**; a name is never accepted where an id belongs.
- Content endpoints may be cached; **availability must be `no-store`**.
- Both sides of every link agree — `doctor.treatment_ids` and
  `treatment.doctor_ids` describe the same set.

Run `node backend/scripts/validate-provider.mjs --base <their-url>` against a
live endpoint. It checks both the shape and the joins, and exits non-zero on
any failure.
