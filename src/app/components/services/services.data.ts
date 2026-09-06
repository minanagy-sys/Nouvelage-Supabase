// Service Data Types and Interfaces
// This file contains all services, offers, and doctors data extracted from the original HTML

export interface ServiceImage {
  type: string;
  src: string;
}

export interface ServiceStep {
  title: string;
  sub: string;
  desc?: string;
  time: string;
}

export interface ServiceResult {
  title: string;
  sub: string;
}

export interface ServiceTimeline {
  time: string;
  label: string;
  desc: string;
}

export interface ServiceProduct {
  logo: string;
  name: string;
  sub: string;
}

export interface BeforeAfter {
  before: string;
  after: string;
  caption: string;
}

export interface Service {
  id: string;
  cat: string;
  group: string;
  title: string;
  subtitle: string;
  tagline: string;
  desc: string;
  images: ServiceImage[];
  cardImage?: string;
  cardRibbon?: string;
  duration: string;
  downtime: string;
  lasts: string;
  sessions: string;
  priceFrom: string;
  price?: number;
  name?: string;
  steps: ServiceStep[];
  results: ServiceResult[];
  timeline: ServiceTimeline[];
  products: ServiceProduct[];
  beforeAfter: BeforeAfter[];
  doctor?: string;
  isActive?: boolean;
  showInGrid?: boolean;
  showPrice?: boolean;
}

export interface OfferMeta {
  label: string;
  value: string;
}

export interface OfferSection {
  kind: string;
  num: string;
  title: string;
  data: any;
}

export interface OfferPrice {
  label: string;
  amount: string;
  note: string;
}

export interface OfferBook {
  label: string;
  href: string;
  wa?: boolean;
}

export interface Offer {
  cat: string;
  title: string;
  subtitle: string;
  tagline: string;
  meta: OfferMeta[];
  sections: OfferSection[];
  price: OfferPrice;
  book: OfferBook;
  heroBg?: string;
}

export interface Doctor {
  name: string;
  role: string;
  exp: string;
  img: string;
  spec?: string;
  deg?: string;
  bio?: string;
  tags?: string[];
  services?: string[];
  yrs?: string;
  rating?: string;
  locs?: string | string[];
}

export interface DoctorRecord {
  [key: string]: Doctor;
}

export interface ServiceDoctors {
  [key: string]: string[];
}

// SERVICES DATA - All 16 Services
export const SERVICES_DATA: Service[] = [
  {
    id:"slim-age", cat:"injection", group:"Body Contour", title:"Slim Age Injection",
    name:"Slim Age Injection",
    subtitle:"Targeted fat dissolving", tagline:"Non-surgical contour refinement — no theatre, no downtime, just gradual definition.",
    desc:"Slim Age uses a medical lipolytic solution injected into stubborn pockets of fat to break down fat cells, which are then cleared naturally by the body. Best for small, defined areas — double chin, flanks, inner thighs — over a planned course of sessions.",
    images:[],
    duration:"30 min", downtime:"Minimal", lasts:"Long-term", sessions:"3–6 course", priceFrom:"From EGP 4,500", price:4500,
    steps:[
      {title:"Consultation & Mapping", sub:"Assess target areas and plan the course", time:"10 min"},
      {title:"Cleanse & Mark", sub:"Antiseptic prep and injection grid", time:"5 min"},
      {title:"Micro-Injections", sub:"Lipolytic solution into fat pockets", time:"10 min"},
      {title:"Aftercare Brief", sub:"Compression and activity guidance", time:"5 min"}
    ],
    results:[
      {title:"Slimmer Contour", sub:"Defined target areas"},
      {title:"No Surgery", sub:"Needle-only, walk-in walk-out"},
      {title:"Gradual & Natural", sub:"Fat cleared over weeks"},
      {title:"Lasting Effect", sub:"Treated cells don't return"}
    ],
    timeline:[
      {time:"Week 2", label:"Onset", desc:"Mild reduction begins"},
      {time:"Week 4", label:"Improving", desc:"Visible slimming"},
      {time:"Week 8", label:"Peak", desc:"Full result per session"},
      {time:"Course", label:"Maintained", desc:"Repeat as planned"}
    ],
    products:[{logo:"A",name:"Aqualyx",sub:"Deoxycholic solution"}],
    beforeAfter:[], doctor:"hana"
  },
  {
    id:"hydrafacial", cat:"skin", group:"HydraFacial", title:"HydraFacial",
    name:"HydraFacial",
    subtitle:"Deep cleanse & hydration", tagline:"7 steps to cleanse and hydrate your skin in one session with zero downtime.",
    desc:"HydraFacial is a medical multi-step protocol using vortex technology to extract impurities and infuse hydration simultaneously. Suitable for all skin types, even sensitive, with an immediate, lasting glow.",
    images:[],
    duration:"45 min", downtime:"None", lasts:"4 weeks", sessions:"Monthly", priceFrom:"From EGP 2,200", price:2200,
    steps:[
      {title:"Cleanse & Exfoliate", sub:"Gentle removal of dead cells", time:"10 min"},
      {title:"Gentle Acid Peel", sub:"Glycolic/salicylic solution", time:"5 min"},
      {title:"Extraction", sub:"Vortex pore suction", time:"15 min"},
      {title:"Hydration Infusion", sub:"Serum & antioxidant infusion", time:"10 min"},
      {title:"Protection", sub:"Mask + sunscreen", time:"5 min"}
    ],
    results:[
      {title:"Glowing Skin", sub:"Immediately after session"},
      {title:"Clearer Pores", sub:"Deep extraction"},
      {title:"Deep Hydration", sub:"Lasts 4 weeks"},
      {title:"Smooth Texture", sub:"Even tone instantly"}
    ],
    timeline:[
      {time:"Instant", label:"Post-session", desc:"Immediate glow"},
      {time:"7 days", label:"Improving", desc:"Smoother feel"},
      {time:"21 days", label:"Peak", desc:"Maximum effect"},
      {time:"Monthly", label:"Follow-up", desc:"To maintain"}
    ],
    products:[{logo:"H",name:"HydraFacial",sub:"MD Vortex System"}],
    beforeAfter:[], doctor:"rana"
  },
  {
    id:"botox", cat:"injection", group:"Botox", title:"Botox",
    name:"Botox",
    subtitle:"Soften expression lines", tagline:"Precise injections that soften wrinkles while preserving your natural expressions.",
    desc:"Botox relaxes the muscles that create dynamic wrinkles — forehead lines, frown lines, crow's feet. Our calibrated dosing softens lines while keeping movement natural. Results appear gradually and last 4–6 months.",
    images:[],
    duration:"15 min", downtime:"None", lasts:"4–6 mo", sessions:"Single", priceFrom:"From EGP 3,000", price:3000,
    steps:[
      {title:"Consultation & Mapping", sub:"Muscle analysis and injection plan", time:"5 min"},
      {title:"Topical Anaesthetic", sub:"Optional numbing cream", time:"3 min"},
      {title:"Precision Injection", sub:"Ultra-fine 32G needle", time:"5 min"},
      {title:"Aftercare Brief", sub:"48-hour protocol & follow-up", time:"2 min"}
    ],
    results:[
      {title:"Smoother Lines", sub:"Forehead & frown creases"},
      {title:"Subtle Brow Lift", sub:"More open-eyed look"},
      {title:"Prevention", sub:"Slows static wrinkles"},
      {title:"Natural Movement", sub:"Expressions preserved"}
    ],
    timeline:[
      {time:"Day 3", label:"Onset", desc:"First effects appear"},
      {time:"Day 7", label:"Improving", desc:"Results refining"},
      {time:"Day 14", label:"Full Result", desc:"Final look settled"},
      {time:"4–6 mo", label:"Duration", desc:"Next session"}
    ],
    products:[{logo:"A",name:"Allergan",sub:"Botox® Vistabel®"},{logo:"M",name:"Merz",sub:"Xeomin® (alt.)"}],
    beforeAfter:[
      {before:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=800&fit=crop", after:"https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=800&fit=crop", caption:"Forehead · Botox — Dr. Yara"},
      {before:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop", after:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=800&fit=crop", caption:"Crow's Feet · Botox — Dr. Yara"}
    ],
    doctor:"yara"
  },
  {
    id:"dermal-fillers", cat:"injection", group:"Fillers", title:"Dermal Fillers",
    name:"Dermal Fillers",
    subtitle:"Restore volume & contour", tagline:"Premium hyaluronic acid to restore volume and refine contours — naturally.",
    desc:"Hyaluronic acid fillers replace lost volume and sculpt definition in lips, cheeks, chin and jawline. Fully reversible and tailored to your face shape, with results that look like you on a good day.",
    images:[],
    duration:"30 min", downtime:"Minimal", lasts:"9–18 mo", sessions:"Single", priceFrom:"From EGP 6,500", price:6500,
    steps:[
      {title:"Consultation & Design", sub:"Facial assessment and plan", time:"10 min"},
      {title:"Numbing", sub:"Topical or filler with anaesthetic", time:"10 min"},
      {title:"Injection & Sculpt", sub:"Cannula or needle, layered", time:"15 min"},
      {title:"Review & Aftercare", sub:"Symmetry check and brief", time:"5 min"}
    ],
    results:[
      {title:"Restored Volume", sub:"Cheeks, lips, chin"},
      {title:"Defined Contour", sub:"Sharper jawline"},
      {title:"Hydrated Look", sub:"HA draws in moisture"},
      {title:"Reversible", sub:"Dissolvable if needed"}
    ],
    timeline:[
      {time:"Instant", label:"Onset", desc:"Volume visible at once"},
      {time:"Day 3", label:"Settling", desc:"Swelling subsides"},
      {time:"Day 14", label:"Final", desc:"Integrated result"},
      {time:"9–18 mo", label:"Duration", desc:"Top-up later"}
    ],
    products:[{logo:"J",name:"Juvéderm",sub:"Vycross® range"},{logo:"R",name:"Restylane",sub:"HA collection"}],
    beforeAfter:[], doctor:"yara"
  },
  {
    id:"skin-booster", cat:"injection", group:"Skin Booster", title:"Skin Booster",
    subtitle:"Luminous, dewy skin", tagline:"Micro-infusions of hyaluronic hydration for skin that glows from within.",
    desc:"Skin boosters deliver stabilised hyaluronic acid into the skin in fine micro-droplets, improving hydration, elasticity and that lit-from-within glow. Ideal for face, neck and hands.",
    images:[],
    duration:"30 min", downtime:"1–2 days", lasts:"4–6 mo", sessions:"2–3 course", priceFrom:"From EGP 5,000",
    steps:[
      {title:"Consultation", sub:"Skin quality assessment", time:"5 min"},
      {title:"Numbing", sub:"Topical anaesthetic cream", time:"15 min"},
      {title:"Micro-Infusion", sub:"Fine droplets across the area", time:"15 min"},
      {title:"Soothe & Brief", sub:"Cooling mask and aftercare", time:"5 min"}
    ],
    results:[
      {title:"Dewy Glow", sub:"Lit-from-within finish"},
      {title:"Better Elasticity", sub:"Firmer, bouncier skin"},
      {title:"Fine Line Softening", sub:"Plumped surface"},
      {title:"Deep Hydration", sub:"Holds moisture for months"}
    ],
    timeline:[
      {time:"Day 3", label:"Onset", desc:"Glow emerges"},
      {time:"Week 2", label:"Improving", desc:"Texture refines"},
      {time:"Week 4", label:"Peak", desc:"Best after course"},
      {time:"4–6 mo", label:"Maintain", desc:"Repeat to sustain"}
    ],
    products:[{logo:"P",name:"Profhilo®",sub:"Bio-remodelling"},{logo:"R",name:"Restylane",sub:"Vital Skinbooster"}],
    beforeAfter:[], doctor:"rana"
  },
  {
    id:"face-plasma", cat:"injection", group:"PRP", title:"Face Plasma",
    subtitle:"Renew with your own plasma", tagline:"PRP plasma to renew tone, texture and your skin's natural radiance.",
    desc:"Platelet-Rich Plasma is drawn from your own blood, concentrated, and reintroduced into the skin to stimulate collagen and repair. A natural route to firmer, brighter, more even skin.",
    images:[],
    duration:"45 min", downtime:"1 day", lasts:"6–12 mo", sessions:"3 course", priceFrom:"From EGP 4,000",
    steps:[
      {title:"Blood Draw", sub:"Small sample taken", time:"5 min"},
      {title:"Centrifuge", sub:"Plasma concentrated", time:"10 min"},
      {title:"Numbing", sub:"Topical cream applied", time:"15 min"},
      {title:"Micro-Injection", sub:"Plasma into target zones", time:"15 min"}
    ],
    results:[
      {title:"Brighter Tone", sub:"Even, radiant skin"},
      {title:"Firmer Texture", sub:"Collagen stimulation"},
      {title:"Natural Source", sub:"Your own plasma"},
      {title:"Scar Softening", sub:"Improves acne marks"}
    ],
    timeline:[
      {time:"Week 2", label:"Onset", desc:"Subtle freshness"},
      {time:"Week 4", label:"Improving", desc:"Tone evens out"},
      {time:"Week 12", label:"Peak", desc:"Collagen matured"},
      {time:"6–12 mo", label:"Maintain", desc:"Annual top-up"}
    ],
    products:[{logo:"P",name:"PRP",sub:"Autologous plasma"}],
    beforeAfter:[], doctor:"rana"
  },
  {
    id:"g-cell-hair", cat:"hair", group:"Hair Therapy", title:"G-Cell Hair Treatment",
    subtitle:"Cellular hair strengthening", tagline:"Advanced cellular therapy to strengthen, densify and revive thinning hair.",
    desc:"G-Cell delivers growth factors and micro-nutrients into the scalp to reawaken dormant follicles, reduce shedding and improve density. A scientific, non-surgical route to healthier hair.",
    images:[],
    duration:"40 min", downtime:"None", lasts:"6 mo", sessions:"4–6 course", priceFrom:"From EGP 5,500",
    steps:[
      {title:"Scalp Analysis", sub:"Density and follicle mapping", time:"10 min"},
      {title:"Prep & Numb", sub:"Cleanse and topical cream", time:"10 min"},
      {title:"Scalp Infusion", sub:"Cellular solution micro-injected", time:"15 min"},
      {title:"Aftercare", sub:"Wash and routine guidance", time:"5 min"}
    ],
    results:[
      {title:"Less Shedding", sub:"From early sessions"},
      {title:"More Density", sub:"Fuller appearance"},
      {title:"Stronger Strands", sub:"Healthier follicles"},
      {title:"Revived Growth", sub:"Dormant follicles wake"}
    ],
    timeline:[
      {time:"Month 1", label:"Onset", desc:"Shedding slows"},
      {time:"Month 3", label:"Improving", desc:"New growth visible"},
      {time:"Month 6", label:"Peak", desc:"Maximum density"},
      {time:"6 mo", label:"Maintain", desc:"Top-up course"}
    ],
    products:[{logo:"G",name:"G-Cell",sub:"Growth-factor complex"}],
    beforeAfter:[], doctor:"omar"
  },
  {
    id:"hair-plasma", cat:"hair", group:"PRP Hair", title:"Hair Plasma (PRP)",
    subtitle:"Regenerative plasma for hair", tagline:"Your own plasma, concentrated to reduce shedding and support new growth.",
    desc:"PRP for hair uses platelets from your own blood to deliver concentrated growth factors into the scalp, prolonging the growth phase, reducing loss and supporting thicker, healthier hair.",
    images:[],
    duration:"45 min", downtime:"None", lasts:"6–9 mo", sessions:"3–4 course", priceFrom:"From EGP 4,000",
    steps:[
      {title:"Blood Draw", sub:"Small sample taken", time:"5 min"},
      {title:"Centrifuge", sub:"Plasma concentrated", time:"10 min"},
      {title:"Numb", sub:"Topical anaesthetic", time:"10 min"},
      {title:"Scalp Injection", sub:"Plasma into thinning zones", time:"15 min"}
    ],
    results:[
      {title:"Reduced Loss", sub:"Less daily shedding"},
      {title:"Thicker Hair", sub:"Improved calibre"},
      {title:"Natural Source", sub:"Your own plasma"},
      {title:"Scalp Health", sub:"Better follicle environment"}
    ],
    timeline:[
      {time:"Month 1", label:"Onset", desc:"Shedding eases"},
      {time:"Month 3", label:"Improving", desc:"Density builds"},
      {time:"Month 6", label:"Peak", desc:"Full benefit"},
      {time:"6–9 mo", label:"Maintain", desc:"Repeat course"}
    ],
    products:[{logo:"P",name:"PRP",sub:"Autologous plasma"}],
    beforeAfter:[], doctor:"omar"
  },
  {
    id:"regenera-activa", cat:"hair", group:"Regenera", title:"Regenera Activa",
    subtitle:"One-session micro-graft", tagline:"A single-session regenerative micro-graft for natural hair restoration.",
    desc:"Regenera Activa harvests a tiny sample of your own scalp, processes it into a regenerative suspension of progenitor cells, and reintroduces it to stimulate follicles — restoration in one visit.",
    images:[],
    duration:"60 min", downtime:"1–2 days", lasts:"12+ mo", sessions:"Single", priceFrom:"From EGP 18,000",
    steps:[
      {title:"Consultation", sub:"Suitability and mapping", time:"10 min"},
      {title:"Micro-Harvest", sub:"Tiny scalp punches taken", time:"15 min"},
      {title:"Processing", sub:"Regenerative suspension prepared", time:"15 min"},
      {title:"Re-Injection", sub:"Cells placed in thinning areas", time:"20 min"}
    ],
    results:[
      {title:"One Session", sub:"No repeated course"},
      {title:"Natural Restoration", sub:"Your own cells"},
      {title:"Denser Growth", sub:"Reactivated follicles"},
      {title:"Long Lasting", sub:"Benefit over 12+ months"}
    ],
    timeline:[
      {time:"Month 2", label:"Onset", desc:"Early regrowth"},
      {time:"Month 4", label:"Improving", desc:"Visible density"},
      {time:"Month 9", label:"Peak", desc:"Full restoration"},
      {time:"12+ mo", label:"Maintain", desc:"Long-term result"}
    ],
    products:[{logo:"R",name:"Regenera",sub:"Activa system"}],
    beforeAfter:[], doctor:"omar"
  },
  {
    id:"laser-hair-removal", cat:"laser", group:"Laser", title:"Laser Hair Removal",
    subtitle:"Lasting, gentle reduction", tagline:"DEKA-certified laser, safe for every skin tone — lasting, comfortable hair reduction.",
    desc:"Our DEKA diode laser targets the hair follicle with precision, disabling regrowth while protecting surrounding skin. Integrated cooling keeps it comfortable, and it's calibrated to be safe across all skin tones.",
    images:[],
    duration:"15–45 min", downtime:"None", lasts:"Long-term", sessions:"6–8 course", priceFrom:"From EGP 1,500",
    steps:[
      {title:"Consultation & Patch", sub:"Skin/hair assessment, test patch", time:"10 min"},
      {title:"Prep & Shave", sub:"Area cleaned and trimmed", time:"5 min"},
      {title:"Laser Pass", sub:"Cooled diode over the area", time:"15 min"},
      {title:"Soothe", sub:"Cooling gel and sun guidance", time:"5 min"}
    ],
    results:[
      {title:"Smoother Skin", sub:"From the first sessions"},
      {title:"Lasting Reduction", sub:"Follicles disabled"},
      {title:"All Skin Tones", sub:"Safe, calibrated settings"},
      {title:"Comfortable", sub:"Integrated cooling"}
    ],
    timeline:[
      {time:"Session 2", label:"Onset", desc:"Slower regrowth"},
      {time:"Session 4", label:"Improving", desc:"Noticeably sparser"},
      {time:"Session 6–8", label:"Peak", desc:"Lasting reduction"},
      {time:"Yearly", label:"Maintain", desc:"Occasional touch-up"}
    ],
    products:[{logo:"D",name:"DEKA",sub:"Motus diode laser"}],
    beforeAfter:[], doctor:"laila"
  },
  {
    id:"chemical-peel", cat:"skin", group:"Peel", title:"Chemical Peel",
    subtitle:"Renew tone & texture", tagline:"Medical-grade peels that resurface for tone, texture and clarity.",
    desc:"A medical chemical peel removes the outer layer of dull, damaged skin to reveal smoother, brighter skin beneath. Depth is tailored to your goals — from a no-downtime refresh to deeper correction.",
    images:[],
    duration:"30 min", downtime:"2–5 days", lasts:"Per course", sessions:"3–4 course", priceFrom:"From EGP 2,000",
    steps:[
      {title:"Consultation", sub:"Skin type and goal review", time:"5 min"},
      {title:"Cleanse & Prep", sub:"Degrease and protect", time:"5 min"},
      {title:"Peel Application", sub:"Solution timed to depth", time:"10 min"},
      {title:"Neutralise & Soothe", sub:"Calm, mask, sunscreen", time:"10 min"}
    ],
    results:[
      {title:"Brighter Tone", sub:"Even, fresh complexion"},
      {title:"Smoother Texture", sub:"Refined surface"},
      {title:"Clearer Skin", sub:"Reduced congestion"},
      {title:"Faded Marks", sub:"Softer pigmentation"}
    ],
    timeline:[
      {time:"Day 3", label:"Peeling", desc:"Shedding phase"},
      {time:"Day 7", label:"Reveal", desc:"Fresh skin emerges"},
      {time:"Week 4", label:"Peak", desc:"Best after course"},
      {time:"Course", label:"Maintain", desc:"Plan repeats"}
    ],
    products:[{logo:"S",name:"SkinCeuticals",sub:"Professional peels"}],
    beforeAfter:[], doctor:"rana"
  },
  {
    id:"laser-resurfacing", cat:"laser", group:"Fractional Laser", title:"Laser Skin Resurfacing",
    subtitle:"Refine scars & texture", tagline:"Precision fractional laser to refine pores, scars and texture.",
    desc:"Fractional laser creates controlled micro-channels that trigger the skin's repair response, remodelling collagen to improve scars, large pores, fine lines and overall texture with measured downtime.",
    images:[],
    duration:"45 min", downtime:"3–5 days", lasts:"12+ mo", sessions:"2–3 course", priceFrom:"From EGP 3,800",
    steps:[
      {title:"Consultation", sub:"Concern mapping and plan", time:"10 min"},
      {title:"Numb", sub:"Topical anaesthetic", time:"20 min"},
      {title:"Laser Pass", sub:"Fractional treatment", time:"15 min"},
      {title:"Recovery Brief", sub:"Cooling and aftercare", time:"5 min"}
    ],
    results:[
      {title:"Refined Pores", sub:"Smaller appearance"},
      {title:"Softer Scars", sub:"Acne and surgical marks"},
      {title:"Even Texture", sub:"Resurfaced skin"},
      {title:"Firmer Skin", sub:"Collagen remodelling"}
    ],
    timeline:[
      {time:"Week 1", label:"Healing", desc:"Redness settles"},
      {time:"Week 4", label:"Improving", desc:"Texture refines"},
      {time:"Month 3", label:"Peak", desc:"Collagen matured"},
      {time:"12+ mo", label:"Maintain", desc:"Annual review"}
    ],
    products:[{logo:"D",name:"DEKA",sub:"CO₂ fractional"}],
    beforeAfter:[], doctor:"laila"
  },
  {
    id:"mesotherapy", cat:"skin", group:"Mesotherapy", title:"Mesotherapy",
    subtitle:"Tailored micro-infusions", tagline:"Vitamin-rich micro-infusions tailored to your skin's goals.",
    desc:"Mesotherapy delivers a bespoke cocktail of vitamins, antioxidants and hyaluronic acid into the skin via tiny injections, nourishing from within for a brighter, healthier, more hydrated complexion.",
    images:[],
    duration:"30 min", downtime:"1 day", lasts:"3–4 mo", sessions:"3–5 course", priceFrom:"From EGP 2,800",
    steps:[
      {title:"Consultation", sub:"Skin goals and cocktail choice", time:"5 min"},
      {title:"Numb", sub:"Topical cream applied", time:"15 min"},
      {title:"Micro-Infusion", sub:"Cocktail across the area", time:"15 min"},
      {title:"Soothe", sub:"Cooling mask and brief", time:"5 min"}
    ],
    results:[
      {title:"Brighter Skin", sub:"Vitamin nourishment"},
      {title:"Hydrated Glow", sub:"HA infusion"},
      {title:"Healthier Tone", sub:"Antioxidant boost"},
      {title:"Customised", sub:"Mixed to your goals"}
    ],
    timeline:[
      {time:"Week 1", label:"Onset", desc:"Fresh look"},
      {time:"Week 3", label:"Improving", desc:"Tone brightens"},
      {time:"Week 6", label:"Peak", desc:"Best after course"},
      {time:"3–4 mo", label:"Maintain", desc:"Repeat to sustain"}
    ],
    products:[{logo:"M",name:"Meso",sub:"Vitamin cocktail"}],
    beforeAfter:[], doctor:"rana"
  },
  {
    id:"carbon-laser", cat:"laser", group:"Carbon Facial", title:"Carbon Laser Facial",
    subtitle:"The red-carpet glow", tagline:"The \"red carpet\" facial for instant glow and refined pores.",
    desc:"A liquid carbon mask is applied and absorbed into pores, then a laser pass vaporises it — drawing out impurities, gently exfoliating and stimulating collagen for an instant, photo-ready glow with zero downtime.",
    images:[],
    duration:"30 min", downtime:"None", lasts:"2–4 weeks", sessions:"Monthly", priceFrom:"From EGP 2,500",
    steps:[
      {title:"Cleanse", sub:"Skin prepped and degreased", time:"5 min"},
      {title:"Carbon Mask", sub:"Liquid carbon absorbed into pores", time:"10 min"},
      {title:"Laser Pass", sub:"Carbon vaporised, pores cleared", time:"10 min"},
      {title:"Soothe", sub:"Cooling and sunscreen", time:"5 min"}
    ],
    results:[
      {title:"Instant Glow", sub:"Photo-ready finish"},
      {title:"Refined Pores", sub:"Cleared and tightened"},
      {title:"Less Oil", sub:"Mattified skin"},
      {title:"No Downtime", sub:"Walk-out radiance"}
    ],
    timeline:[
      {time:"Instant", label:"Post-session", desc:"Immediate glow"},
      {time:"Day 3", label:"Settled", desc:"Pores refined"},
      {time:"Week 2", label:"Lasting", desc:"Clear complexion"},
      {time:"Monthly", label:"Maintain", desc:"Repeat for glow"}
    ],
    products:[{logo:"C",name:"Carbon Q",sub:"Q-switched laser"}],
    beforeAfter:[], doctor:"laila"
  },
  {
    id:"thread-lift", cat:"injection", group:"Thread Lift", title:"Thread Lift",
    subtitle:"Subtle lift & support", tagline:"Dissolvable PDO threads for subtle lifting and natural support.",
    desc:"PDO thread lifting places fine dissolvable threads beneath the skin to gently reposition and support sagging tissue, while stimulating collagen along the thread path. A non-surgical step between fillers and a facelift.",
    images:[],
    duration:"45 min", downtime:"3–5 days", lasts:"12–18 mo", sessions:"Single", priceFrom:"From EGP 12,000",
    steps:[
      {title:"Consultation & Design", sub:"Lift vectors mapped", time:"10 min"},
      {title:"Numb", sub:"Local anaesthetic", time:"10 min"},
      {title:"Thread Placement", sub:"Cannula inserts PDO threads", time:"20 min"},
      {title:"Review & Brief", sub:"Symmetry and aftercare", time:"5 min"}
    ],
    results:[
      {title:"Subtle Lift", sub:"Repositioned contours"},
      {title:"Natural Support", sub:"No surgery"},
      {title:"Collagen Boost", sub:"Builds along threads"},
      {title:"Defined Jawline", sub:"Tighter lower face"}
    ],
    timeline:[
      {time:"Instant", label:"Lift", desc:"Immediate effect"},
      {time:"Week 2", label:"Settling", desc:"Threads integrate"},
      {time:"Month 2", label:"Peak", desc:"Collagen matures"},
      {time:"12–18 mo", label:"Duration", desc:"Refresh later"}
    ],
    products:[{logo:"P",name:"PDO",sub:"Polydioxanone threads"}],
    beforeAfter:[], doctor:"yara"
  },
  {
    id:"consultation", cat:"skin", group:"Visit", title:"Consultation",
    subtitle:"Your personalised plan", tagline:"A complimentary, no-pressure plan built entirely around you.",
    desc:"Begin with a one-to-one assessment of your skin, hair and goals with a Nouvelage specialist. We discuss what's realistic, map a treatment journey, and answer every question — with no obligation.",
    images:[],
    duration:"30 min", downtime:"None", lasts:"—", sessions:"As needed", priceFrom:"Complimentary",
    steps:[
      {title:"Welcome", sub:"Understand your goals", time:"5 min"},
      {title:"Assessment", sub:"Skin and hair analysis", time:"15 min"},
      {title:"The Plan", sub:"Tailored recommendations", time:"8 min"},
      {title:"Next Steps", sub:"Pricing and scheduling", time:"2 min"}
    ],
    results:[
      {title:"Clear Plan", sub:"Mapped to your goals"},
      {title:"Honest Advice", sub:"No pressure to book"},
      {title:"Expert Insight", sub:"From a specialist"},
      {title:"Complimentary", sub:"No charge to begin"}
    ],
    timeline:[
      {time:"Today", label:"Visit", desc:"Assessment done"},
      {time:"Same day", label:"Plan", desc:"Recommendations given"},
      {time:"Your pace", label:"Begin", desc:"Start when ready"},
      {time:"Ongoing", label:"Support", desc:"We guide throughout"}
    ],
    products:[{logo:"N",name:"Nouvelage",sub:"Specialist team"}],
    beforeAfter:[], doctor:"hana"
  }
];

// OFFERS DATA - All 4 Offers
export const OFFERS: Offer[] = [
/* 0 — Featured: complimentary first consultation */
    {
      cat:"Featured", title:"Your first consultation", subtitle:"on us",
      tagline:"A private, one-to-one assessment of your skin, your concerns and your goals — at no charge, and with no obligation to book.",
      meta:[{label:"Duration",value:"45 min"},{label:"Cost",value:"Complimentary"},{label:"With",value:"A specialist"},{label:"Format",value:"In-clinic"}],
      sections:[
        {kind:"steps", num:"01 — In the room", title:"What to <em>expect</em>", data:[
          {title:"Skin analysis", sub:"A close read of your skin's condition, type and history"},
          {title:"Your goals", sub:"We listen first — what's bothering you, what you'd love to change"},
          {title:"A tailored plan", sub:"Treatments, sequence and realistic timelines, mapped to you"},
          {title:"Transparent pricing", sub:"Clear, itemised pricing before anything is booked"}
        ]},
        {kind:"text", num:"02 — Why", title:"Why it's <em>complimentary</em>", data:"Because the right plan starts with understanding you. There's no pressure to decide on the day — you'll leave with honest advice and a written plan, whether or not you choose to proceed."}
      ],
      price:{label:"Investment", amount:"Complimentary", note:"Limited consultation slots each week — subject to availability"},
      book:{label:"Book your consultation", href:"#book"}
    },
    /* 1 — Skin · Glow: HydraFacial */
    {
      cat:"Skin · Glow", title:"The HydraFacial ritual", subtitle:"instant glow",
      tagline:"Cleanse, exfoliate, extract and hydrate in one calm session — for skin that looks lit-from-within the moment you leave.",
      meta:[{label:"Duration",value:"30–45 min"},{label:"Downtime",value:"None"},{label:"Glow lasts",value:"5–7 days"},{label:"Best in",value:"A course of 3–6"}],
      sections:[
        {kind:"steps", num:"01 — How", title:"How it <em>works</em>", data:[
          {title:"Cleanse & peel", sub:"Gentle resurfacing to lift dead skin", time:"~10 min"},
          {title:"Extract", sub:"Painless vortex suction clears congestion", time:"~10 min"},
          {title:"Hydrate", sub:"Antioxidant + peptide serums infused deep", time:"~10 min"},
          {title:"Glow boost", sub:"Optional LED or brightening finish", time:"opt."}
        ]},
        {kind:"results", num:"02 — Results", title:"What you'll <em>notice</em>", data:[
          {title:"Brighter tone", sub:"Even, refreshed and radiant"},
          {title:"Smoother texture", sub:"Softer, more refined skin"},
          {title:"Refined pores", sub:"Clearer, less congested"},
          {title:"Plump hydration", sub:"Bouncy, dewy finish"}
        ]},
        {kind:"text", num:"03 — Packages", title:"Single, or a <em>course</em>", data:"Book a single session before an event, or a course of 3–6 for lasting clarity. Seasonal package pricing is available — just ask at your consultation."}
      ],
      price:{label:"Investment", amount:"Ask about packages", note:"Single & course pricing confirmed at consultation"},
      book:{label:"Explore facials", href:"#book"}
    },
    /* 2 — Laser by the course */
    {
      cat:"Laser", title:"Laser, by the course", subtitle:"planned for you",
      tagline:"Full-body or single-area laser hair reduction, priced as a tailored course and planned entirely around your skin and hair type.",
      meta:[{label:"Sessions",value:"6–8 typical"},{label:"Spacing",value:"4–6 weeks"},{label:"Areas",value:"Face → body"},{label:"Downtime",value:"Minimal"}],
      sections:[
        {kind:"steps", num:"01 — The plan", title:"How a <em>course</em> works", data:[
          {title:"Patch test & skin typing", sub:"We confirm the right settings for you safely"},
          {title:"Personalised areas", sub:"Your plan is built around the zones you choose"},
          {title:"Sessions on cycle", sub:"Spaced to match how your hair actually grows"},
          {title:"Maintenance", sub:"Occasional top-ups keep results lasting"}
        ]},
        {kind:"results", num:"02 — Results", title:"What you'll <em>achieve</em>", data:[
          {title:"Smoother skin", sub:"Soft, even and stubble-free"},
          {title:"Lasting reduction", sub:"Up to ~90% over the course*"},
          {title:"No ingrowns", sub:"Fewer bumps and irritation"},
          {title:"Time back", sub:"Far less shaving and waxing"}
        ]},
        {kind:"text", num:"03 — Why a course", title:"Why <em>a series</em>, not one session", data:"Hair grows in cycles, so lasting reduction needs a planned series rather than a one-off. Course pricing lowers the per-session cost and locks your plan in from the start. *Results typical and vary by skin and hair type."}
      ],
      price:{label:"Investment", amount:"Tailored package pricing", note:"Built around your areas & skin type at consultation"},
      book:{label:"Plan your course", href:"#book"}
    },
    /* 3 — Gift card */
    {
      cat:"Gifting", title:"The gift of considered care", subtitle:"for someone you love",
      tagline:"A Nouvelage gift card — beauty and wellness, given with intention. Choose an amount or a treatment; we'll present it beautifully.",
      meta:[{label:"Value",value:"Any amount"},{label:"Validity",value:"12 months"},{label:"Delivery",value:"Digital / printed"},{label:"Use on",value:"Any service"}],
      sections:[
        {kind:"steps", num:"01 — How", title:"How it <em>works</em>", data:[
          {title:"Choose", sub:"Pick a value, or a specific treatment"},
          {title:"We prepare it", sub:"A beautifully presented card, in your name"},
          {title:"Send or collect", sub:"Delivered digitally or collected in-clinic"},
          {title:"Redeem", sub:"Used against any service, valid 12 months"}
        ]},
        {kind:"list", num:"02 — Occasions", title:"Ways to <em>give</em>", data:[
          {strong:"Birthdays & celebrations", text:"— a treat that feels personal"},
          {strong:"Bridal & pre-wedding", text:"— glow for the big moments"},
          {strong:"Thank-you & corporate", text:"— considered, elevated gifting"},
          {strong:"Just because", text:"— wellness, whenever it's wanted"}
        ]}
      ],
      price:{label:"Choose your amount", amount:"From EGP 1,000", note:"Popular: 1,000 · 2,500 · 5,000 — or any custom amount"},
      book:{label:"Gift a treatment", href:"#book", wa:true}
    }

];

// DOCTORS DATA
export const DOCS: DoctorRecord = {
  "randa-el-aguizy": {
    img: "/assets/Nouvelage doctors/randa.png",
    name: "Dr. Randa El Aguizy",
    role: "Dermatologist & Cosmetic Laser Specialist",
    spec: "Dermatologist & Cosmetic Laser Specialist",
    deg: "Dermatologist & Cosmetic Laser Specialist",
    exp: "10+ years experience",
    yrs: "10+",
    rating: "4.9★",
    bio: "Dr. Randa El Aguizy is a highly skilled dermatologist and cosmetic laser specialist with extensive experience in advanced skin treatments.",
    tags: ["Laser", "Aesthetic", "Dermatology"],
    locs: "All Locations"
  },
  "poussy-maher": {
    img: "/assets/Nouvelage doctors/Pussi.png",
    name: "Dr. Poussy Maher",
    role: "Dermatologist & Aesthetic Medicine Specialist",
    spec: "Dermatologist & Aesthetic Medicine Specialist",
    deg: "Dermatologist & Aesthetic Medicine Specialist",
    exp: "8+ years experience",
    yrs: "8+",
    rating: "4.9★",
    bio: "Dr. Poussy Maher specializes in dermatology and aesthetic medicine, providing comprehensive skin care solutions.",
    tags: ["Aesthetic Medicine", "Dermatology"],
    locs: "All Locations"
  },
  "ghada-amer": {
    img: "/assets/Nouvelage doctors/ghada.png",
    name: "Dr. Ghada Amer",
    role: "Dermatologist & Cosmetic Procedures Expert",
    spec: "Dermatologist & Cosmetic Procedures Expert",
    deg: "Dermatologist & Cosmetic Procedures Expert",
    exp: "7+ years experience",
    yrs: "7+",
    rating: "4.9★",
    bio: "Dr. Ghada Amer is an expert in dermatology and cosmetic procedures, delivering exceptional aesthetic results.",
    tags: ["Aesthetic Medicine", "Dermatology"],
    locs: "All Locations"
  },
  "mai-mohamed-abdellatif": {
    img: "/assets/Nouvelage doctors/Mai mohamed.png",
    name: "Dr. Mai Mohamed Abdellatif",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "5+ years experience",
    yrs: "5+",
    rating: "4.8★",
    bio: "Dr. Mai Mohamed Abdellatif is a dedicated dermatologist focused on providing quality skin care treatments.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "mai-mohsen": {
    img: "/assets/Nouvelage doctors/mai mohsen.png",
    name: "Dr. Mai Mohsen",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "6+ years experience",
    yrs: "6+",
    rating: "4.8★",
    bio: "Dr. Mai Mohsen brings expertise in dermatological care and patient-centered treatment approaches.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "toka-tharwat": {
    img: "/assets/Nouvelage doctors/Toka tharwat.png",
    name: "Dr. Toka Tharwat",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "9+ years experience",
    yrs: "9+",
    rating: "4.9★",
    bio: "Dr. Toka Tharwat is a skilled dermatologist committed to excellence in skin health and aesthetics.",
    tags: ["Dermatology", "Aesthetic"],
    locs: "All Locations"
  },
  "nourhan-ashraf": {
    img: "/assets/Nouvelage doctors/nourhan ashraf.png",
    name: "Dr. Nourhan Ashraf",
    role: "Dermatologist & Aesthetic Specialist",
    spec: "Dermatologist & Aesthetic Specialist",
    deg: "Dermatologist & Aesthetic Specialist",
    exp: "5+ years experience",
    yrs: "5+",
    rating: "4.8★",
    bio: "Dr. Nourhan Ashraf specializes in dermatology and aesthetic treatments with a focus on natural results.",
    tags: ["Aesthetic Medicine", "Dermatology"],
    locs: "All Locations"
  },
  "marian-adel": {
    img: "/assets/Nouvelage doctors/marina adel.png",
    name: "Dr. Marian Adel",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "8+ years experience",
    yrs: "8+",
    rating: "4.8★",
    bio: "Dr. Marian Adel provides comprehensive dermatological services with expertise in various skin conditions.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "sandy-tarek-fathallah": {
    img: "/assets/Nouvelage doctors/sandy tarek.png",
    name: "Dr. Sandy Tarek Fathallah",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "4+ years experience",
    yrs: "4+",
    rating: "4.8★",
    bio: "Dr. Sandy Tarek Fathallah is committed to delivering personalized dermatological care and treatment.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "yasmine-baraka": {
    img: "/assets/Nouvelage doctors/Yasmine baraka.png",
    name: "Dr. Yasmine Baraka",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "6+ years experience",
    yrs: "6+",
    rating: "4.8★",
    bio: "Dr. Yasmine Baraka offers expert dermatological consultations and advanced skin treatments.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "nora-maged": {
    img: "/assets/Nouvelage doctors/nora maged.png",
    name: "Dr. Nora Maged",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "5+ years experience",
    yrs: "5+",
    rating: "4.8★",
    bio: "Dr. Nora Maged is dedicated to providing effective dermatological solutions for all skin types.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "mirna-abdelkader-elkayal": {
    img: "/assets/Nouvelage doctors/mirna abdelkader.png",
    name: "Dr. Mirna Abdelkader Elkayal",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "7+ years experience",
    yrs: "7+",
    rating: "4.8★",
    bio: "Dr. Mirna Abdelkader Elkayal brings extensive knowledge in dermatology and skin health management.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "shrouk-yehia": {
    img: "/assets/Nouvelage doctors/shrouk yehia.png",
    name: "Dr. Shrouk Yehia",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "6+ years experience",
    yrs: "6+",
    rating: "4.8★",
    bio: "Dr. Shrouk Yehia specializes in dermatology with a patient-first approach to skin care.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "dimiana": {
    img: "/assets/Nouvelage doctors/marina adel.png",
    name: "Dr. Dimiana",
    role: "Dermatologist",
    spec: "Dermatologist",
    deg: "Dermatologist",
    exp: "6+ years experience",
    yrs: "6+",
    rating: "4.8★",
    bio: "Dr. Dimiana provides expert dermatological care with a focus on innovative treatment methods.",
    tags: ["Dermatology", "Skin Care"],
    locs: "All Locations"
  },
  "team": {
    img: "/assets/Nouvelage doctors/randa.png",
    name: "Nouvelage Team",
    role: "Dermatology & Aesthetic Medicine Team",
    spec: "Dermatology & Aesthetic Medicine Team",
    deg: "Dermatology & Aesthetic Medicine Team",
    exp: "Collective expertise",
    yrs: "15+",
    rating: "4.9★",
    bio: "Our expert team of dermatologists and aesthetic specialists work together to provide comprehensive care.",
    tags: ["Dermatology", "Aesthetic Medicine", "Team"],
    locs: "All Locations"
  }
};

export const SVC_DOCTORS: ServiceDoctors = {
  "slim-age":["team"],
  "hydrafacial":["poussy-maher","ghada-amer","randa-el-aguizy"],
  "botox":["ghada-amer","marian-adel","nourhan-ashraf","dimiana"],
  "dermal-fillers":["randa-el-aguizy","ghada-amer","dimiana","poussy-maher"],
  "skin-booster":["ghada-amer","nourhan-ashraf","poussy-maher"],
  "face-plasma":["team"],
  "g-cell-hair":["ghada-amer","randa-el-aguizy","marian-adel"],
  "hair-plasma":["randa-el-aguizy","ghada-amer","dimiana"],
  "regenera-activa":["poussy-maher","dimiana","randa-el-aguizy"],
  "laser-hair-removal":["team"],
  "chemical-peel":["poussy-maher","ghada-amer","randa-el-aguizy"],
  "laser-resurfacing":["randa-el-aguizy","ghada-amer","dimiana"],
  "mesotherapy":["team"],
  "carbon-laser":["team"],
  "thread-lift":["randa-el-aguizy","dimiana","ghada-amer"],
  "consultation":["team"]
};
