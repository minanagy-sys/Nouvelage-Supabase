import type { Doctor } from './doctors.service';

/**
 * Initial/fallback doctor profiles. Generated from the former embedded data:
 * every image now lives on disk under /assets/img/media-library/doctors/ —
 * this file carries paths only, never base64.
 */
export const INITIAL_DOCTORS: Doctor[] = [
  {
    "id": "doc_001",
    "slug": "randa-el-aguizy",
    "name": "Dr. Randa El Aguizy",
    "title": "Dr.",
    "specialization": "Derma Consultant",
    "subSpecialties": [
      "All services except laser hair removal"
    ],
    "qualifications": [
      "MD",
      "Board Certified Dermatologist"
    ],
    "certificates": [
      "Licensed · Egyptian Medical Syndicate",
      "International certification in aesthetic medicine"
    ],
    "experience": 13,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Madinty The Strip",
      "Mall Of Arabia",
      "Mohandseen",
      "Nouvelage HQ",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/Nouvelage doctors/randa.png",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-1-after.webp",
        "description": "Fillers full face",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-2-after.webp",
        "description": "Hybrid fillersfull face",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-3-after.webp",
        "description": "fillers full face",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-4-after.webp",
        "description": "fillers full face",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-5-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-5-after.webp",
        "description": "Lip Filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-6-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-6-after.webp",
        "description": "lip fillers+chin",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-7-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-7-after.webp",
        "description": "Lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-8-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-8-after.webp",
        "description": "Lip Filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-9-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-9-after.webp",
        "description": "Lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-10-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-10-after.webp",
        "description": "Lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-11-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-11-after.webp",
        "description": "chin+lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-12-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-12-after.webp",
        "description": "Lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-13-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-13-after.webp",
        "description": "jaw fillers+chin+lips",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-14-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-14-after.webp",
        "description": "Lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-11-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-11-after.webp",
        "description": "chin+lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-13-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-13-after.webp",
        "description": "jaw fillers+chin+lips",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-17-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-17-after.webp",
        "description": "Chin Filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-18-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-18-after.webp",
        "description": "Filler tear trough",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-19-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-19-after.webp",
        "description": "full face rejuvenation",
        "procedure": "Biostimulator"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-20-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-20-after.webp",
        "description": "Threads",
        "procedure": "PDO threads"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-21-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-21-after.webp",
        "description": "Threads",
        "procedure": "PDO threads"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-22-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-22-after.webp",
        "description": "Plasma Hair",
        "procedure": "Plasma (PRP) — hair"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-23-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-23-after.webp",
        "description": "Stem Cells Hair",
        "procedure": "Stem cells — hair"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-24-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-24-after.webp",
        "description": "Stem Cells Hair",
        "procedure": "Stem cells — hair"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-25-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-25-after.webp",
        "description": "Stem Cells Hair",
        "procedure": "Stem cells — hair"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-26-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-26-after.webp",
        "description": "Regenera Activa",
        "procedure": "Regenera Activa"
      },
      {
        "before": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-27-before.webp",
        "after": "/assets/img/media-library/doctors/randa-el-aguizy/cases/case-27-after.webp",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      }
    ],
    "bio": "Dr. Randa El Aguizy is a highly skilled dermatologist and aesthetic consultant with extensive experience in advanced skin treatments.",
    "about": "Dr. Randa El Aguizy is a highly skilled dermatologist and aesthetic consultant with extensive experience in advanced skin treatments. Combines medical precision with aesthetic artistry to deliver natural, confidence-enhancing results.",
    "expertise": [
      "Medical Dermatology",
      "Aesthetic Dermatology",
      "Anti-aging Treatments"
    ],
    "treatments": [
      {
        "name": "All services except laser hair removal",
        "description": "Comprehensive aesthetic treatments including injectables, fillers, skin rejuvenation, and advanced procedures, excluding laser hair removal services."
      }
    ],
    "bookingLink": "/book",
    "featured": true,
    "order": 1,
    "active": true,
    "img": "/assets/Nouvelage doctors/randa.png",
    "role": "Dermatologist & Aesthetic Consultant",
    "spec": "Dermatologist & Aesthetic Consultant",
    "deg": "Dermatologist & Aesthetic Consultant",
    "exp": "13+ years experience",
    "yrs": "13+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Madinty The Strip",
      "Mall Of Arabia",
      "Mohandseen",
      "Nouvelage HQ",
      "Zayed"
    ]
  },
  {
    "id": "doc_002",
    "slug": "poussy-maher",
    "name": "Dr. Poussy Maher",
    "title": "Dr.",
    "specialization": "Derma Consultant",
    "subSpecialties": [
      "All services except laser hair removal"
    ],
    "qualifications": [
      "MD",
      "Board Certified Dermatologist"
    ],
    "certificates": [],
    "experience": 12,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/poussy-maher.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/poussy-maher/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/poussy-maher/cases/case-1-after.webp",
        "description": "full face fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/poussy-maher/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/poussy-maher/cases/case-2-after.webp",
        "description": "lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/poussy-maher/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/poussy-maher/cases/case-3-after.webp",
        "description": "Melasma treatment",
        "procedure": "Peeling"
      },
      {
        "before": "/assets/img/media-library/doctors/poussy-maher/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/poussy-maher/cases/case-4-after.webp",
        "description": "Regenera Activa",
        "procedure": "Regenera Activa"
      },
      {
        "before": "/assets/img/media-library/doctors/poussy-maher/cases/case-5-before.webp",
        "after": "/assets/img/media-library/doctors/poussy-maher/cases/case-5-after.webp",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      }
    ],
    "bio": "Expert dermatology consultant specializing in comprehensive aesthetic treatments and skin health.",
    "about": "Expert dermatology consultant specializing in comprehensive aesthetic treatments and skin health.",
    "expertise": [
      "Medical Dermatology",
      "Aesthetic Dermatology",
      "Skin Rejuvenation"
    ],
    "treatments": [
      {
        "name": "All services except laser hair removal",
        "description": "Comprehensive aesthetic treatments including injectables, fillers, skin rejuvenation, and advanced procedures, excluding laser hair removal services."
      }
    ],
    "bookingLink": "/book",
    "featured": true,
    "order": 2,
    "active": true,
    "img": "/assets/img/doctors/poussy-maher.jpg",
    "role": "Dermatologist & Aesthetic Consultant",
    "spec": "Dermatologist & Aesthetic Consultant",
    "deg": "Dermatologist & Aesthetic Consultant",
    "exp": "12+ years experience",
    "yrs": "12+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ]
  },
  {
    "id": "doc_003",
    "slug": "ghada-amer",
    "name": "Dr. Ghada Amer",
    "title": "Dr.",
    "specialization": "Derma Consultant",
    "subSpecialties": [
      "All services except laser hair removal"
    ],
    "qualifications": [
      "MD",
      "Board Certified Dermatologist"
    ],
    "certificates": [],
    "experience": 12,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/ghada-amer.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-1-after.webp",
        "description": "face fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-2-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-3-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-4-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-5-before.webp",
        "after": "",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-6-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-6-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-7-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-7-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-8-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-8-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-9-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-9-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-10-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-10-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-11-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-12-after.webp",
        "description": "Botox forehead",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-13-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-13-after.webp",
        "description": "chin and face fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-14-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-14-after.webp",
        "description": "17_ Chin filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-15-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-15-after.webp",
        "description": "Jaw line filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-16-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-16-after.webp",
        "description": "filler tear trough",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-17-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-17-after.webp",
        "description": "Peeling underarm",
        "procedure": "Peeling"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-18-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-18-after.webp",
        "description": "Neck lifting",
        "procedure": "Neck treatment"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-19-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-19-after.webp",
        "description": "Neck lifting",
        "procedure": "Neck treatment"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-20-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-20-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-21-before.webp",
        "after": "",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-22-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-23-before.webp",
        "after": "",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-24-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-25-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-26-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-26-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-27-before.webp",
        "after": "",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-28-before.webp",
        "after": "",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-29-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-29-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-30-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-31-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-31-after.webp",
        "description": "Gummy smile",
        "procedure": "Botox"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-32-after.webp",
        "description": "Exosomes Scalp",
        "procedure": "Exocel (Exosomes)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-33-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-33-after.webp",
        "description": "Exosomes Scalp",
        "procedure": "Exocel (Exosomes)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-34-before.webp",
        "after": "",
        "description": "Exosomes Scalp",
        "procedure": "Exocel (Exosomes)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-35-before.webp",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-35-after.webp",
        "description": "Exosomes Scalp",
        "procedure": "Exocel (Exosomes)"
      },
      {
        "before": "/assets/img/media-library/doctors/ghada-amer/cases/case-36-before.webp",
        "after": "",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/ghada-amer/cases/case-37-after.webp",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      }
    ],
    "bio": "Highly experienced dermatology consultant providing advanced aesthetic and medical dermatology solutions.",
    "about": "Highly experienced dermatology consultant providing advanced aesthetic and medical dermatology solutions.",
    "expertise": [
      "Medical Dermatology",
      "Aesthetic Dermatology",
      "Advanced Skin Treatments"
    ],
    "treatments": [
      {
        "name": "All services except laser hair removal",
        "description": "Comprehensive aesthetic treatments including injectables, fillers, skin rejuvenation, and advanced procedures, excluding laser hair removal services."
      }
    ],
    "bookingLink": "/book",
    "featured": true,
    "order": 3,
    "active": true,
    "img": "/assets/img/doctors/ghada-amer.jpg",
    "role": "Dermatologist & Aesthetic Consultant",
    "spec": "Dermatologist & Aesthetic Consultant",
    "deg": "Dermatologist & Aesthetic Consultant",
    "exp": "12+ years experience",
    "yrs": "12+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ]
  },
  {
    "id": "doc_004",
    "slug": "mai-mohsen",
    "name": "Dr. Mai Mohsen",
    "title": "Dr.",
    "specialization": "Senior Specialist",
    "subSpecialties": [
      "All services except laser hair removal"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 10,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran",
      "Madinty The Strip"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/mai-mohsen.jpg",
    "beforeAfterGallery": [],
    "bio": "Senior dermatology specialist with extensive experience in aesthetic and medical dermatology.",
    "about": "Senior dermatology specialist with extensive experience in aesthetic and medical dermatology.",
    "expertise": [
      "Medical Dermatology",
      "Aesthetic Treatments",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All services except laser hair removal",
        "description": "Comprehensive aesthetic treatments including injectables, fillers, skin rejuvenation, and advanced procedures, excluding laser hair removal services."
      }
    ],
    "bookingLink": "/book",
    "featured": true,
    "order": 4,
    "active": true,
    "img": "/assets/img/doctors/mai-mohsen.jpg",
    "role": "Senior Dermatology Specialist",
    "spec": "Senior Dermatology Specialist",
    "deg": "Senior Dermatology Specialist",
    "exp": "10+ years experience",
    "yrs": "10+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran",
      "Madinty The Strip"
    ]
  },
  {
    "id": "doc_005",
    "slug": "merna-ashraf",
    "name": "Dr. Merna Ashraf",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 7,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Mall Of Arabia",
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/merna-ashraf.jpg",
    "beforeAfterGallery": [],
    "bio": "Skilled dermatology specialist offering comprehensive aesthetic treatments.",
    "about": "Skilled dermatology specialist offering comprehensive aesthetic treatments.",
    "expertise": [
      "Aesthetic Dermatology",
      "Laser Treatments",
      "Injectables"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 5,
    "active": true,
    "img": "/assets/img/doctors/merna-ashraf.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "7+ years experience",
    "yrs": "7+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Mall Of Arabia",
      "Mohandseen"
    ]
  },
  {
    "id": "doc_006",
    "slug": "hossam-shehab",
    "name": "Dr. Hossam Shehab",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "City Stars"
    ],
    "availableDays": [],
    "gender": "male",
    "profileImage": "/assets/img/doctors/hossam-shehab.jpg",
    "beforeAfterGallery": [],
    "bio": "Male dermatology specialist providing all aesthetic services including male laser treatments.",
    "about": "Male dermatology specialist providing all aesthetic services including male laser treatments.",
    "expertise": [
      "Male Laser Treatments",
      "Aesthetic Dermatology",
      "All Services"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      },
      {
        "name": "Male laser only",
        "description": "Laser hair removal and skin treatments specifically tailored for male patients, addressing masculine hair patterns and skin concerns."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 6,
    "active": true,
    "img": "/assets/img/doctors/hossam-shehab.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "City Stars"
    ]
  },
  {
    "id": "doc_007",
    "slug": "salma-ahmed",
    "name": "Dr. Salma Ahmed",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 7,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Mall Of Arabia",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/salma-ahmed.jpg",
    "beforeAfterGallery": [],
    "bio": "Experienced dermatology specialist focusing on aesthetic treatments and facial laser.",
    "about": "Experienced dermatology specialist focusing on aesthetic treatments and facial laser.",
    "expertise": [
      "Aesthetic Dermatology",
      "Facial Laser",
      "Injectables"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 7,
    "active": true,
    "img": "/assets/img/doctors/salma-ahmed.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "7+ years experience",
    "yrs": "7+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Mall Of Arabia",
      "Zayed"
    ]
  },
  {
    "id": "doc_008",
    "slug": "marian-adel",
    "name": "Dr. Marian Adel",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 8,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Madinty The Strip",
      "Mall Of Arabia",
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/marian-adel.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-1-before.webp",
        "after": "",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-2-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-3-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-4-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-5-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-6-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-6-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-7-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-7-after.webp",
        "description": "Chin filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-8-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-8-after.webp",
        "description": "chin filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-9-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-9-after.webp",
        "description": "botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-10-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-10-after.webp",
        "description": "botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-11-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-11-after.webp",
        "description": "botox Gummy smile",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-12-before.webp",
        "after": "",
        "description": "botox Gummy smile",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-13-before.webp",
        "after": "",
        "description": "botox Gummy smile",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/marian-adel/cases/case-14-before.webp",
        "after": "/assets/img/media-library/doctors/marian-adel/cases/case-14-after.webp",
        "description": "Stem Cells Hair",
        "procedure": "Stem cells — hair"
      }
    ],
    "bio": "Versatile dermatology specialist providing all aesthetic services.",
    "about": "Versatile dermatology specialist providing all aesthetic services.",
    "expertise": [
      "All Aesthetic Services",
      "Laser Treatments",
      "Medical Dermatology"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      },
      {
        "name": "Male laser: All areas except boxer",
        "description": "Complete laser hair removal for male patients covering all body areas excluding the boxer/intimate zone, tailored to masculine needs."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 8,
    "active": true,
    "img": "/assets/img/doctors/marian-adel.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "8+ years experience",
    "yrs": "8+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Madinty The Strip",
      "Mall Of Arabia",
      "Mohandseen"
    ]
  },
  {
    "id": "doc_009",
    "slug": "dimiana-saif",
    "name": "Dr. Dimiana Saif",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "City Stars",
      "Madinty The Strip"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/dimiana-saif.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-1-after.webp",
        "description": "full face fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-2-after.webp",
        "description": "lip filler 3",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-3-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-4-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-5-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-5-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-6-before.webp",
        "after": "",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-7-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-7-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-8-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-8-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-9-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-9-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-10-after.webp",
        "description": "Neck Rejuvenation",
        "procedure": "Neck treatment"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-11-before.webp",
        "after": "",
        "description": "Neck Rejuvenation",
        "procedure": "Neck treatment"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-12-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-12-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-13-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-13-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-14-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-14-after.webp",
        "description": "Botox crows feet",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-15-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-15-after.webp",
        "description": "Plasma Hair",
        "procedure": "Plasma (PRP) — hair"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-16-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-16-after.webp",
        "description": "Stem Cells Hair",
        "procedure": "Stem cells — hair"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-17-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-17-after.webp",
        "description": "Regenera Activa",
        "procedure": "Regenera Activa"
      },
      {
        "before": "/assets/img/media-library/doctors/dimiana-saif/cases/case-18-before.webp",
        "after": "/assets/img/media-library/doctors/dimiana-saif/cases/case-18-after.webp",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      }
    ],
    "bio": "Dedicated dermatology specialist with expertise in aesthetic treatments.",
    "about": "Dedicated dermatology specialist with expertise in aesthetic treatments.",
    "expertise": [
      "Aesthetic Dermatology",
      "Laser Treatments",
      "Skin Rejuvenation"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: All areas except boxer",
        "description": "Complete laser hair removal for male patients covering all body areas excluding the boxer/intimate zone, tailored to masculine needs."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 9,
    "active": true,
    "img": "/assets/img/doctors/dimiana-saif.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "City Stars",
      "Madinty The Strip"
    ]
  },
  {
    "id": "doc_010",
    "slug": "nesma-saad",
    "name": "Dr. Nesma Saad",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "El Rehab",
      "Madinity",
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/nesma-saad.jpg",
    "beforeAfterGallery": [],
    "bio": "Skilled dermatology specialist serving both Nouvelage and ZAT locations.",
    "about": "Skilled dermatology specialist serving both Nouvelage and ZAT locations.",
    "expertise": [
      "Aesthetic Dermatology",
      "Facial Laser",
      "Injectables"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 10,
    "active": true,
    "img": "/assets/img/doctors/nesma-saad.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "El Rehab",
      "Madinity",
      "Mohandseen"
    ]
  },
  {
    "id": "doc_011",
    "slug": "toka-tharwat",
    "name": "Dr. Toka Tharwat",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "Mall Of Arabia",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/toka-tharwat.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/toka-tharwat/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/toka-tharwat/cases/case-1-after.webp",
        "description": "fillers full face",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/toka-tharwat/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/toka-tharwat/cases/case-2-after.webp",
        "description": "chin filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/toka-tharwat/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/toka-tharwat/cases/case-3-after.webp",
        "description": "Gummy smile",
        "procedure": "Botox"
      }
    ],
    "bio": "Professional dermatology specialist with focus on aesthetic treatments.",
    "about": "Professional dermatology specialist with focus on aesthetic treatments.",
    "expertise": [
      "Aesthetic Dermatology",
      "Facial Laser",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 11,
    "active": true,
    "img": "/assets/img/doctors/toka-tharwat.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "Mall Of Arabia",
      "Zayed"
    ]
  },
  {
    "id": "doc_012",
    "slug": "asmaa-el-fawal-alex",
    "name": "Dr. Asmaa El Fawal Alex",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 8,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/asmaa-el-fawal.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-1-after.webp",
        "description": "Slimage Unit",
        "procedure": "Slim Age — lipolysis"
      },
      {
        "before": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-2-after.webp",
        "description": "Lipolysis",
        "procedure": "Meso-lipolysis"
      },
      {
        "before": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-3-after.webp",
        "description": "Nutrition Session",
        "procedure": "Nutrition + Onda"
      },
      {
        "before": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-4-after.webp",
        "description": "Nutrition Session",
        "procedure": "Nutrition + Onda"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-5-after.webp",
        "description": "Nutrition Session",
        "procedure": "Nutrition + Onda"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-6-after.webp",
        "description": "Nutrition Session",
        "procedure": "Nutrition + Onda"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-7-after.webp",
        "description": "Nutrition Session",
        "procedure": "Nutrition + Onda"
      },
      {
        "before": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-8-before.webp",
        "after": "/assets/img/media-library/doctors/asmaa-el-fawal-alex/cases/case-8-after.webp",
        "description": "Wegovy",
        "procedure": "Wegovy — weight"
      }
    ],
    "bio": "Alexandria-based dermatology specialist providing comprehensive aesthetic services.",
    "about": "Alexandria-based dermatology specialist providing comprehensive aesthetic services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Skin Treatments"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 12,
    "active": true,
    "img": "/assets/img/doctors/asmaa-el-fawal.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "8+ years experience",
    "yrs": "8+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ]
  },
  {
    "id": "doc_013",
    "slug": "sara-asem",
    "name": "Dr. Sara Asem",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "El Rehab",
      "Madinity"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/sara-asem.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-1-after.webp",
        "description": "fillers full face",
        "procedure": "Filler (HA)"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-2-after.webp",
        "description": "lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-3-after.webp",
        "description": "Lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-4-before.webp",
        "after": "",
        "description": "lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-5-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-5-after.webp",
        "description": "Lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-6-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-6-after.webp",
        "description": "10 ttt Undereye hyperpigmentation",
        "procedure": "Xela Rederm"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-7-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-7-after.webp",
        "description": "peeling",
        "procedure": "Peeling"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-8-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-8-after.webp",
        "description": "Anti-aging protocol",
        "procedure": "Biostimulator"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-9-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-9-after.webp",
        "description": "Rich",
        "procedure": "Biostimulator"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-10-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-10-after.webp",
        "description": "Rich",
        "procedure": "Biostimulator"
      },
      {
        "before": "/assets/img/media-library/doctors/sara-asem/cases/case-11-before.webp",
        "after": "/assets/img/media-library/doctors/sara-asem/cases/case-11-after.webp",
        "description": "Mesotherapy",
        "procedure": "Hair mesotherapy"
      }
    ],
    "bio": "Dermatology specialist serving both Nouvelage and ZAT branches.",
    "about": "Dermatology specialist serving both Nouvelage and ZAT branches.",
    "expertise": [
      "Aesthetic Dermatology",
      "Injectables",
      "Skin Rejuvenation"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 13,
    "active": true,
    "img": "/assets/img/doctors/sara-asem.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "El Rehab",
      "Madinity"
    ]
  },
  {
    "id": "doc_014",
    "slug": "hend-farid",
    "name": "Dr. Hend Farid",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except body filler"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 7,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/hend-farid.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/hend-farid/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/hend-farid/cases/case-1-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/hend-farid/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/hend-farid/cases/case-2-after.webp",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      },
      {
        "before": "/assets/img/media-library/doctors/hend-farid/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/hend-farid/cases/case-3-after.webp",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      }
    ],
    "bio": "Experienced dermatology specialist at CFC with laser expertise.",
    "about": "Experienced dermatology specialist at CFC with laser expertise.",
    "expertise": [
      "Aesthetic Dermatology",
      "Laser Treatments",
      "Injectables"
    ],
    "treatments": [
      {
        "name": "All except body filler",
        "description": "Comprehensive aesthetic treatments including facial fillers, injectables, laser procedures, and skin therapies, excluding body contouring fillers."
      },
      {
        "name": "Male laser: Face, underarm, chest, back",
        "description": "Extensive laser hair removal services for male patients including facial, underarm, chest, and back areas for comprehensive hair reduction."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 14,
    "active": true,
    "img": "/assets/img/doctors/hend-farid.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "7+ years experience",
    "yrs": "7+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "CFC"
    ]
  },
  {
    "id": "doc_015",
    "slug": "shrouk-yehia",
    "name": "Dr. Shrouk Yehia",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "Mall Of Arabia",
      "Mohandseen",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/shrouk-yehia.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/shrouk-yehia/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/shrouk-yehia/cases/case-1-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/shrouk-yehia/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/shrouk-yehia/cases/case-2-after.webp",
        "description": "botox forehead",
        "procedure": "Botox"
      }
    ],
    "bio": "Dermatology specialist offering comprehensive aesthetic treatments.",
    "about": "Dermatology specialist offering comprehensive aesthetic treatments.",
    "expertise": [
      "Aesthetic Dermatology",
      "Injectables",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 15,
    "active": true,
    "img": "/assets/img/doctors/shrouk-yehia.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "Mall Of Arabia",
      "Mohandseen",
      "Zayed"
    ]
  },
  {
    "id": "doc_016",
    "slug": "nourhan-ashraf",
    "name": "Dr. Nourhan Ashraf",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "El Rehab",
      "Madinity",
      "Mall Of Arabia",
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/nourhan-ashraf.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-1-after.webp",
        "description": "skin booster",
        "procedure": "Skin booster"
      },
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-2-after.webp",
        "description": "face fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-3-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-4-after.webp",
        "description": "lip filler",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-5-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-5-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-6-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-6-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-7-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-7-after.webp",
        "description": "Gummy Smile",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-8-before.webp",
        "after": "/assets/img/media-library/doctors/nourhan-ashraf/cases/case-8-after.webp",
        "description": "Botox crows feet",
        "procedure": "Botox"
      }
    ],
    "bio": "Versatile dermatology specialist serving multiple branches.",
    "about": "Versatile dermatology specialist serving multiple branches.",
    "expertise": [
      "Aesthetic Dermatology",
      "Injectables",
      "Skin Treatments"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 16,
    "active": true,
    "img": "/assets/img/doctors/nourhan-ashraf.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "El Rehab",
      "Madinity",
      "Mall Of Arabia",
      "Mohandseen"
    ]
  },
  {
    "id": "doc_017",
    "slug": "sarah-tayel",
    "name": "Dr. Sarah Tayel",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 7,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/sarah-tayel.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria-based specialist providing all aesthetic services.",
    "about": "Alexandria-based specialist providing all aesthetic services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Laser Treatments"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 17,
    "active": true,
    "img": "/assets/img/doctors/sarah-tayel.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "7+ years experience",
    "yrs": "7+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ]
  },
  {
    "id": "doc_018",
    "slug": "yasmin-baraka",
    "name": "Dr. Yasmin Baraka",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except filler, botox, biostimulators and threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "HydraFacial",
      "Chemical Peel",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "Madinty The Strip",
      "Mall Of Arabia"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/yasmin-baraka.jpg",
    "beforeAfterGallery": [],
    "bio": "Dermatology specialist focusing on laser and skin treatments.",
    "about": "Dermatology specialist focusing on laser and skin treatments.",
    "expertise": [
      "Laser Treatments",
      "Skin Care",
      "Peeling & Dermapen"
    ],
    "treatments": [
      {
        "name": "All except filler, botox, biostimulators and threads",
        "description": "Specialized aesthetic services focusing on laser treatments, skin rejuvenation, and non-injectable procedures."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 18,
    "active": true,
    "img": "/assets/img/doctors/yasmin-baraka.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "Madinty The Strip",
      "Mall Of Arabia"
    ]
  },
  {
    "id": "doc_019",
    "slug": "mirna-abdelkader",
    "name": "Dr. Mirna Abdelkader",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/mirna-abdelkader.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser treatment specialist with expertise in male laser procedures.",
    "about": "Laser treatment specialist with expertise in male laser procedures.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal",
      "Male Laser"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: Face, chest, underarm",
        "description": "Laser hair removal for male patients targeting facial areas, chest, and underarm regions for long-lasting hair reduction."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 19,
    "active": true,
    "img": "/assets/img/doctors/mirna-abdelkader.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ]
  },
  {
    "id": "doc_020",
    "slug": "aya-shrief",
    "name": "Dr. Aya Shrief",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "Mohandseen",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/aya-shrief.jpg",
    "beforeAfterGallery": [],
    "bio": "Skilled dermatology specialist in aesthetic treatments.",
    "about": "Skilled dermatology specialist in aesthetic treatments.",
    "expertise": [
      "Aesthetic Dermatology",
      "Facial Laser",
      "Injectables"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 20,
    "active": true,
    "img": "/assets/img/doctors/aya-shrief.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "Mohandseen",
      "Zayed"
    ]
  },
  {
    "id": "doc_021",
    "slug": "hadeer-mohamed",
    "name": "Dr. Hadeer Mohamed",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "El Rehab"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/hadeer-mohamed.jpg",
    "beforeAfterGallery": [],
    "bio": "Dermatology specialist serving both Nouvelage and ZAT.",
    "about": "Dermatology specialist serving both Nouvelage and ZAT.",
    "expertise": [
      "Aesthetic Dermatology",
      "Facial Laser",
      "Skin Treatments"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 21,
    "active": true,
    "img": "/assets/img/doctors/hadeer-mohamed.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "El Rehab"
    ]
  },
  {
    "id": "doc_022",
    "slug": "heba-abdelhalim",
    "name": "Dr. Heba Abdelhalim",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 7,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/heba-abdelhalim.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria specialist providing comprehensive dermatology services.",
    "about": "Alexandria specialist providing comprehensive dermatology services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Laser Treatments"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 22,
    "active": true,
    "img": "/assets/img/doctors/heba-abdelhalim.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "7+ years experience",
    "yrs": "7+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ]
  },
  {
    "id": "doc_023",
    "slug": "nada-fekry",
    "name": "Dr. Nada Fekry",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "El Rehab"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/nada-fekry.jpg",
    "beforeAfterGallery": [],
    "bio": "Dermatology specialist at CFC and El Rehab.",
    "about": "Dermatology specialist at CFC and El Rehab.",
    "expertise": [
      "Aesthetic Dermatology",
      "Injectables",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 23,
    "active": true,
    "img": "/assets/img/doctors/nada-fekry.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "El Rehab"
    ]
  },
  {
    "id": "doc_024",
    "slug": "nourhan-hosny",
    "name": "Dr. Nourhan Hosny",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/nourhan-hosny.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria-based specialist offering all aesthetic services.",
    "about": "Alexandria-based specialist offering all aesthetic services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Skin Treatments"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 24,
    "active": true,
    "img": "/assets/img/doctors/nourhan-hosny.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy"
    ]
  },
  {
    "id": "doc_025",
    "slug": "shery-magdy",
    "name": "Dr. Shery Magdy",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/shery-magdy.jpg",
    "beforeAfterGallery": [],
    "bio": "Dermatology specialist at Zayed branch.",
    "about": "Dermatology specialist at Zayed branch.",
    "expertise": [
      "Aesthetic Dermatology",
      "Injectables",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 25,
    "active": true,
    "img": "/assets/img/doctors/shery-magdy.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "Zayed"
    ]
  },
  {
    "id": "doc_026",
    "slug": "nouran-ahmed",
    "name": "Dr. Nouran Ahmed",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "El Rehab",
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/nouran-ahmed.jpg",
    "beforeAfterGallery": [],
    "bio": "Dermatology specialist with laser expertise.",
    "about": "Dermatology specialist with laser expertise.",
    "expertise": [
      "Aesthetic Dermatology",
      "Laser Treatments",
      "Injectables"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      },
      {
        "name": "Male laser: Face, back, chest, underarm",
        "description": "Comprehensive laser hair removal for male patients covering facial areas, back, chest, and underarms for complete grooming solutions."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 26,
    "active": true,
    "img": "/assets/img/doctors/nouran-ahmed.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "El Rehab",
      "Mohandseen"
    ]
  },
  {
    "id": "doc_027",
    "slug": "reem-al-kabbash",
    "name": "Dr. Reem Al-Kabbash",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except threads"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "El Rehab",
      "Madinity"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/reem-al-kabbash.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-1-after.webp",
        "description": "Lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-2-after.webp",
        "description": "Lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-3-after.webp",
        "description": "Lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-4-before.webp",
        "after": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-4-after.webp",
        "description": "Lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-5-before.webp",
        "after": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-5-after.webp",
        "description": "Lip fillers",
        "procedure": "Filler (HA)"
      },
      {
        "before": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-6-before.webp",
        "after": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-6-after.webp",
        "description": "Botox Forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-7-before.webp",
        "after": "/assets/img/media-library/doctors/reem-al-kabbash/cases/case-7-after.webp",
        "description": "Botox crows feet",
        "procedure": "Botox"
      }
    ],
    "bio": "ZAT specialist in aesthetic dermatology.",
    "about": "ZAT specialist in aesthetic dermatology.",
    "expertise": [
      "Aesthetic Dermatology",
      "Injectables",
      "Skin Treatments"
    ],
    "treatments": [
      {
        "name": "All except threads",
        "description": "Full spectrum of aesthetic services including injectables, fillers, and laser treatments, with the exception of thread lift procedures."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 27,
    "active": true,
    "img": "/assets/img/doctors/reem-al-kabbash.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "El Rehab",
      "Madinity"
    ]
  },
  {
    "id": "doc_028",
    "slug": "batoul-baradei",
    "name": "Dr. Batoul Baradei",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Madinity"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/batoul-baradei.jpg",
    "beforeAfterGallery": [],
    "bio": "ZAT Madinity specialist providing all services.",
    "about": "ZAT Madinity specialist providing all services.",
    "expertise": [
      "All Aesthetic Services",
      "Facial Laser",
      "Injectables"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 28,
    "active": true,
    "img": "/assets/img/doctors/batoul-baradei.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.9,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Madinity"
    ]
  },
  {
    "id": "doc_029",
    "slug": "merna-mamdouh",
    "name": "Dr. Merna Mamdouh",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/merna-mamdouh.jpg",
    "beforeAfterGallery": [],
    "bio": "Dermatology specialist providing comprehensive services.",
    "about": "Dermatology specialist providing comprehensive services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Laser Treatments"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 29,
    "active": true,
    "img": "/assets/img/doctors/merna-mamdouh.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Madinty The Strip"
    ]
  },
  {
    "id": "doc_030",
    "slug": "rawan-mabrouk",
    "name": "Dr. Rawan Mabrouk",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 6,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/rawan-mabrouk.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria specialist offering all aesthetic services.",
    "about": "Alexandria specialist offering all aesthetic services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 30,
    "active": true,
    "img": "/assets/img/doctors/rawan-mabrouk.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "6+ years experience",
    "yrs": "6+",
    "rating": 4.8,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy",
      "Loran"
    ]
  },
  {
    "id": "doc_031",
    "slug": "hazem-magdi",
    "name": "Dr. Hazem Magdi",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "CFC",
      "City Stars",
      "Madinty The Strip",
      "Mall Of Arabia"
    ],
    "availableDays": [],
    "gender": "male",
    "profileImage": "/assets/img/doctors/hazem-magdi.jpg",
    "beforeAfterGallery": [],
    "bio": "Male laser specialist serving male patients exclusively.",
    "about": "Male laser specialist serving male patients exclusively.",
    "expertise": [
      "Laser Treatments",
      "Male Laser",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: All areas (male patients only)",
        "description": "Comprehensive full-body laser hair removal services exclusively for male patients, covering all treatment areas including intimate zones."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 31,
    "active": true,
    "img": "/assets/img/doctors/hazem-magdi.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "CFC",
      "City Stars",
      "Madinty The Strip",
      "Mall Of Arabia"
    ]
  },
  {
    "id": "doc_032",
    "slug": "menna-salman",
    "name": "Dr. Menna Salman",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except filler"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Laser Hair Removal"
    ],
    "branches": [
      "Mall Of Arabia",
      "Mohandseen",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/menna-salman.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/menna-salman/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/menna-salman/cases/case-1-after.webp",
        "description": "Peeling",
        "procedure": "Peeling"
      },
      {
        "before": "/assets/img/media-library/doctors/menna-salman/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/menna-salman/cases/case-2-after.webp",
        "description": "Stem Cells Hair",
        "procedure": "Stem cells — hair"
      },
      {
        "before": "",
        "after": "/assets/img/media-library/doctors/menna-salman/cases/case-3-after.webp",
        "description": "Stem Cells Hair",
        "procedure": "Stem cells — hair"
      }
    ],
    "bio": "Dermatology specialist with laser expertise.",
    "about": "Dermatology specialist with laser expertise.",
    "expertise": [
      "Aesthetic Dermatology",
      "Facial Laser",
      "Skin Treatments"
    ],
    "treatments": [
      {
        "name": "All except filler",
        "description": "Wide range of aesthetic services including laser treatments, skin rejuvenation, and other procedures, excluding dermal filler injections."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 32,
    "active": true,
    "img": "/assets/img/doctors/menna-salman.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Skin Care",
      "Dermatology"
    ],
    "locs": [
      "Mall Of Arabia",
      "Mohandseen",
      "Zayed"
    ]
  },
  {
    "id": "doc_033",
    "slug": "dina-saleh",
    "name": "Dr. Dina Saleh",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All except under-eye filler"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Mall Of Arabia",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/dina-saleh.jpg",
    "beforeAfterGallery": [
      {
        "before": "/assets/img/media-library/doctors/dina-saleh/cases/case-1-before.webp",
        "after": "/assets/img/media-library/doctors/dina-saleh/cases/case-1-after.webp",
        "description": "Botox forehead",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/dina-saleh/cases/case-2-before.webp",
        "after": "/assets/img/media-library/doctors/dina-saleh/cases/case-2-after.webp",
        "description": "Gummy Smile",
        "procedure": "Botox"
      },
      {
        "before": "/assets/img/media-library/doctors/dina-saleh/cases/case-3-before.webp",
        "after": "/assets/img/media-library/doctors/dina-saleh/cases/case-3-after.webp",
        "description": "Post Acne Scars",
        "procedure": "Device — Fractional/RF"
      }
    ],
    "bio": "Dermatology specialist in aesthetic treatments.",
    "about": "Dermatology specialist in aesthetic treatments.",
    "expertise": [
      "Aesthetic Dermatology",
      "Injectables",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All except under-eye filler",
        "description": "Full aesthetic treatment portfolio including facial fillers, laser procedures, and skin therapies, excluding under-eye tear trough filler treatments."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 33,
    "active": true,
    "img": "/assets/img/doctors/dina-saleh.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Mall Of Arabia",
      "Zayed"
    ]
  },
  {
    "id": "doc_034",
    "slug": "engy-mahrous",
    "name": "Dr. Engy Mahrous",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 4,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "City Stars"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/engy-mahrous.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser treatment specialist at City Stars.",
    "about": "Laser treatment specialist at City Stars.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal",
      "Male Laser"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: Face, chest, underarm",
        "description": "Laser hair removal for male patients targeting facial areas, chest, and underarm regions for long-lasting hair reduction."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 34,
    "active": true,
    "img": "/assets/img/doctors/engy-mahrous.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "4+ years experience",
    "yrs": "4+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "City Stars"
    ]
  },
  {
    "id": "doc_035",
    "slug": "mariam-adel",
    "name": "Dr. Mariam Adel",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 4,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/mariam-adel.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser specialist at Mohandseen.",
    "about": "Laser specialist at Mohandseen.",
    "expertise": [
      "Laser Treatments",
      "Facial Laser",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 35,
    "active": true,
    "img": "/assets/img/doctors/mariam-adel.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "4+ years experience",
    "yrs": "4+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Mohandseen"
    ]
  },
  {
    "id": "doc_036",
    "slug": "sara-abdel-kader",
    "name": "Dr. Sara AbdEl-Kader",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 4,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Mall Of Arabia",
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/sara-abdelkader.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser treatment specialist.",
    "about": "Laser treatment specialist.",
    "expertise": [
      "Laser Treatments",
      "Facial Laser",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 36,
    "active": true,
    "img": "/assets/img/doctors/sara-abdelkader.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "4+ years experience",
    "yrs": "4+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Mall Of Arabia",
      "Mohandseen"
    ]
  },
  {
    "id": "doc_037",
    "slug": "alaa-hassan",
    "name": "Dr. Alaa Hassan",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 4,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Mall Of Arabia",
      "Mohandseen"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/alaa-hassan.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser treatment specialist.",
    "about": "Laser treatment specialist.",
    "expertise": [
      "Laser Treatments",
      "Facial Laser",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 37,
    "active": true,
    "img": "/assets/img/doctors/alaa-hassan.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "4+ years experience",
    "yrs": "4+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Mall Of Arabia",
      "Mohandseen"
    ]
  },
  {
    "id": "doc_038",
    "slug": "alaa-adel",
    "name": "Dr. Alaa Adel",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/alaa-adel.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria specialist providing all services.",
    "about": "Alexandria specialist providing all services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Laser Treatments"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 38,
    "active": true,
    "img": "/assets/img/doctors/alaa-adel.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy"
    ]
  },
  {
    "id": "doc_039",
    "slug": "alaa-sami",
    "name": "Dr. Alaa Sami",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Loran"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/alaa-sami.jpg",
    "beforeAfterGallery": [],
    "bio": "Loran specialist offering all aesthetic services.",
    "about": "Loran specialist offering all aesthetic services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 39,
    "active": true,
    "img": "/assets/img/doctors/alaa-sami.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Loran"
    ]
  },
  {
    "id": "doc_040",
    "slug": "dareen-alsayed",
    "name": "Dr. Dareen Alsayed",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 3,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "CFC"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/dareen-alsayed.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser specialist serving female patients only.",
    "about": "Laser specialist serving female patients only.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal",
      "Female Patients"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Female patients only",
        "description": "Specialized treatments exclusively for female patients, addressing feminine aesthetic needs with personalized care and privacy."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 40,
    "active": true,
    "img": "/assets/img/doctors/dareen-alsayed.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "3+ years experience",
    "yrs": "3+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "CFC"
    ]
  },
  {
    "id": "doc_041",
    "slug": "dina-mohamed",
    "name": "Dr. Dina Mohamed",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 3,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Mall Of Arabia"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/dina-mohamed.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser treatment specialist at Mall Of Arabia.",
    "about": "Laser treatment specialist at Mall Of Arabia.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 41,
    "active": true,
    "img": "/assets/img/doctors/dina-mohamed.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "3+ years experience",
    "yrs": "3+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Mall Of Arabia"
    ]
  },
  {
    "id": "doc_042",
    "slug": "omnia",
    "name": "Dr. Omnia",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 3,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Alex Camp Chizar"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/omnia.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria laser specialist.",
    "about": "Alexandria laser specialist.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 42,
    "active": true,
    "img": "/assets/img/doctors/omnia.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "3+ years experience",
    "yrs": "3+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Alex Camp Chizar"
    ]
  },
  {
    "id": "doc_043",
    "slug": "menna",
    "name": "Dr. Menna",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 3,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Alex Camp Chizar"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/menna.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria laser specialist.",
    "about": "Alexandria laser specialist.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 43,
    "active": true,
    "img": "/assets/img/doctors/menna.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "3+ years experience",
    "yrs": "3+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Alex Camp Chizar"
    ]
  },
  {
    "id": "doc_044",
    "slug": "eriny-emad",
    "name": "Dr. Eriny Emad",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser, dermapen & peeling"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 4,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Chemical Peel",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Madinity"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/eriny-emad.jpg",
    "beforeAfterGallery": [],
    "bio": "ZAT Madinity specialist in laser and skin treatments.",
    "about": "ZAT Madinity specialist in laser and skin treatments.",
    "expertise": [
      "Laser Treatments",
      "Dermapen",
      "Peeling",
      "Facial Laser"
    ],
    "treatments": [
      {
        "name": "Laser, dermapen & peeling",
        "description": "Combined treatments including laser therapy, microneedling with dermapen for collagen induction, and chemical peeling for comprehensive skin rejuvenation."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 44,
    "active": true,
    "img": "/assets/img/doctors/eriny-emad.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "4+ years experience",
    "yrs": "4+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Dermapen",
      "Peeling",
      "Skin Care"
    ],
    "locs": [
      "Madinity"
    ]
  },
  {
    "id": "doc_045",
    "slug": "esraa",
    "name": "Dr. Esraa",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 3,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Alex Camp Chizar",
      "Alex Roshdy"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/esraa.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria laser treatment specialist.",
    "about": "Alexandria laser treatment specialist.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 45,
    "active": true,
    "img": "/assets/img/doctors/esraa.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "3+ years experience",
    "yrs": "3+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Alex Camp Chizar",
      "Alex Roshdy"
    ]
  },
  {
    "id": "doc_046",
    "slug": "hania",
    "name": "Dr. Hania",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 3,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Alex Roshdy"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/hania.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria laser specialist.",
    "about": "Alexandria laser specialist.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 46,
    "active": true,
    "img": "/assets/img/doctors/hania.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "3+ years experience",
    "yrs": "3+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Alex Roshdy"
    ]
  },
  {
    "id": "doc_047",
    "slug": "howaidaadel",
    "name": "Dr. Howaida.Adel",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 4,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "City Stars",
      "El Rehab",
      "Madinty The Strip"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/howaida-adel.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser specialist serving both Nouvelage and ZAT.",
    "about": "Laser specialist serving both Nouvelage and ZAT.",
    "expertise": [
      "Laser Treatments",
      "Facial Laser",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: Face, underarm",
        "description": "Laser hair removal treatments for male patients focusing on facial and underarm areas using state-of-the-art laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 47,
    "active": true,
    "img": "/assets/img/doctors/howaida-adel.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "4+ years experience",
    "yrs": "4+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "City Stars",
      "El Rehab",
      "Madinty The Strip"
    ]
  },
  {
    "id": "doc_048",
    "slug": "julia-al-wedad",
    "name": "Dr. Julia Al Wedad",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 4,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "City Stars",
      "Mohandseen",
      "Zayed"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/julia-al-wedad.jpg",
    "beforeAfterGallery": [],
    "bio": "Laser treatment specialist.",
    "about": "Laser treatment specialist.",
    "expertise": [
      "Laser Treatments",
      "Facial Laser",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      },
      {
        "name": "Male laser: Face",
        "description": "Laser hair removal for male facial areas including beard, neck, and facial contours using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 48,
    "active": true,
    "img": "/assets/img/doctors/julia-al-wedad.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "4+ years experience",
    "yrs": "4+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "City Stars",
      "Mohandseen",
      "Zayed"
    ]
  },
  {
    "id": "doc_049",
    "slug": "mai-soffar",
    "name": "Dr. Mai Soffar",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "Laser only"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 3,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Laser Hair Removal",
      "Laser Resurfacing",
      "Carbon Laser"
    ],
    "branches": [
      "Alex Camp Chizar"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/mai-soffar.jpg",
    "beforeAfterGallery": [],
    "bio": "Alexandria laser specialist.",
    "about": "Alexandria laser specialist.",
    "expertise": [
      "Laser Treatments",
      "Hair Removal"
    ],
    "treatments": [
      {
        "name": "Laser only",
        "description": "Specialized laser treatments for hair removal, skin rejuvenation, pigmentation correction, and vascular lesion treatment using advanced laser technology."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 49,
    "active": true,
    "img": "/assets/img/doctors/mai-soffar.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "3+ years experience",
    "yrs": "3+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Hair Removal"
    ],
    "locs": [
      "Alex Camp Chizar"
    ]
  },
  {
    "id": "doc_050",
    "slug": "merna-masoud",
    "name": "Dr. Merna Masoud",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Loran"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/merna-masoud.jpg",
    "beforeAfterGallery": [],
    "bio": "Loran specialist providing all aesthetic services.",
    "about": "Loran specialist providing all aesthetic services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Laser Treatments"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 50,
    "active": true,
    "img": "/assets/img/doctors/merna-masoud.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Loran"
    ]
  },
  {
    "id": "doc_051",
    "slug": "nada-tarek",
    "name": "Dr. Nada Tarek",
    "title": "Dr.",
    "specialization": "Derma Specialist",
    "subSpecialties": [
      "All services"
    ],
    "qualifications": [
      "MD",
      "Dermatology Specialist"
    ],
    "certificates": [],
    "experience": 5,
    "languages": [
      "English",
      "Arabic"
    ],
    "services": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "HydraFacial",
      "Botox",
      "Dermal Fillers",
      "Chemical Peel",
      "Thread Lift",
      "Skin Booster",
      "Hair Plasma",
      "G-Cell Hair",
      "Laser Resurfacing",
      "Regenera Activa",
      "Mesotherapy",
      "Carbon Laser",
      "Face Plasma",
      "Slim Age",
      "Laser Hair Removal"
    ],
    "branches": [
      "Loran"
    ],
    "availableDays": [],
    "gender": "female",
    "profileImage": "/assets/img/doctors/nada-tarek.jpg",
    "beforeAfterGallery": [],
    "bio": "Loran specialist offering comprehensive dermatology services.",
    "about": "Loran specialist offering comprehensive dermatology services.",
    "expertise": [
      "All Aesthetic Services",
      "Medical Dermatology",
      "Skin Care"
    ],
    "treatments": [
      {
        "name": "All services",
        "description": "Complete range of aesthetic and cosmetic treatments including injectables, fillers, laser procedures, and advanced skin rejuvenation therapies."
      }
    ],
    "bookingLink": "/book",
    "featured": false,
    "order": 51,
    "active": true,
    "img": "/assets/img/doctors/nada-tarek.jpg",
    "role": "Dermatology Specialist",
    "spec": "Dermatology Specialist",
    "deg": "Dermatology Specialist",
    "exp": "5+ years experience",
    "yrs": "5+",
    "rating": 4.7,
    "tags": [
      "Laser",
      "Injectables",
      "Anti-Ageing",
      "Aesthetic Medicine",
      "Dermatology"
    ],
    "locs": [
      "Loran"
    ]
  }
];
