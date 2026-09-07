import { Injectable } from '@angular/core';
import { AdminContentService } from './admin-content.service';

@Injectable({
  providedIn: 'root'
})
export class DemoModeService {
  private isDemoMode = true; // Set to true for demo access

  constructor(private adminSupabase: AdminContentService) {}

  // Demo data for all pages (default fallback only)
  private demoPageContent: { [key: string]: any } = {
    landing: {
      // Brand Header Logo
      logo_url: '/assets/img/nouvelage-logo-white.svg',
      logo_alt: 'Nouvelage® Aesthetic Clinics',

      // For Her Panel
      forher_bg_image: '/assets/img/home-for-her.jpg',
      forher_eyebrow: 'LUXURY TREATMENTS',
      forher_welcome: 'For Her',
      forher_subtitle: 'Embrace Your Natural Beauty',
      forher_cta_text: 'Explore Services',
      forher_cta_link: '/forher',

      // For Him Panel
      forhim_bg_image: '/assets/img/home-for-him.jpg',
      forhim_eyebrow: 'PREMIUM GROOMING',
      forhim_welcome: 'For Him',
      forhim_subtitle: 'Redefine Your Confidence',
      forhim_cta_text: 'Discover Treatments',
      forhim_cta_link: '/forhim',

      // Locations (you can make this an array if you have multiple locations)
      locations: 'Zamalek, Cairo • New Cairo • 6th of October',

      // Display Settings
      animation_duration: 1000,
      overlay_opacity: 0.6,

      // SEO & Meta Tags
      meta_title: 'Nouvelage - Luxury Aesthetic Clinic in Egypt',
      meta_description: "Egypt's premier aesthetic clinic offering world-class beauty treatments for both men and women. Experience excellence in skincare, wellness, and transformation.",
      meta_keywords: 'aesthetic clinic egypt, luxury spa cairo, beauty treatments, cosmetic clinic, skincare egypt'
    },
    forher: {
      // Section 1: HERO
      hero_eyebrow: 'Nouvel Age · Cairo · Giza · Alexandria',
      hero_title: 'Where Beauty Meets',
      hero_title_em: 'Medical Excellence',
      hero_slogan: 'Nouvel Âge, Nouvelle Vie',
      hero_subtitle: 'Discover the art of beauty and wellness at Nouvel Age, where advanced technology meets deeply personalized care — across skin, injectables, laser, and hair.',
      hero_actions: [
        { text: 'Book Consultation', link: '#contact', style: 'gold' },
        { text: 'View Treatments', link: '/services', style: 'light' }
      ],
      hero_stats: [
        { value: '188', suffix: 'K+', label: 'Customers Served' },
        { value: '70', suffix: '+', label: 'Services' },
        { value: '76', suffix: '', label: 'Expert Doctors' },
        { value: '11', suffix: '', label: 'Branches' }
      ],
      hero_slides: [
        '/assets/img/hero-forher-1.jpg',
        '/assets/img/hero-forher-2.jpg',
        '/assets/img/hero-forher-3.jpg'
      ],

      // Section 2: APPROACH
      approach_eyebrow: 'Our Approach',
      approach_title: 'Four Pillars of',
      approach_title_em: 'Considered Care',
      approach_lead: 'Face, hair, body and lasers — every discipline under one roof, each held to a single, uncompromising standard.',
      approach_grid: [
        { icon: 'face', title: 'Face treatments', description: 'Discover the art of beauty and wellness at Nouvel Age, where advanced technology meets deeply personalized care — across skin, injectables, laser, and hair.', image: '/assets/img/approach/face-treatments.jpg' },
        { icon: 'hair', title: 'Hair restoration', description: 'Restoration and growth therapies that strengthen hair and renew confidence, with proven modern techniques.', image: '/assets/img/approach/hair-restoration.jpg' },
        { icon: 'laser', title: 'Laser treatments', description: 'Advanced laser for hair removal, resurfacing and rejuvenation — precise, and safe for every skin tone.', image: '/assets/img/approach/laser-treatments.jpg' },
        { icon: 'body', title: 'Body treatments', description: 'Face, hair, body and lasers — every discipline under one roof, each held to a single, uncompromising standard.', image: '/assets/img/approach/body-treatments.jpg' }
      ],

      // Section 3: EXPERTISE
      expertise_eyebrow: 'Trending Now',
      expertise_title: 'Our Most',
      expertise_title_em: 'Trending',
      expertise_lead: 'The latest in aesthetic science — the innovations our clients are asking for most this season, performed by certified specialists.',
      expertise_grid: [
        { title: 'Peptides', description: 'Skin & Hair · Regenerative · Collagen', image: '/assets/img/exp-peptides.jpg', link: '/services', buttonLabel: 'Explore Treatment' },
        { title: 'New Body Contouring', description: 'Latest Machines · Non-Surgical · Sculpting', image: '/assets/img/exp-new-body-contouring.jpg', link: '/services', buttonLabel: 'Explore Treatment' },
        { title: 'Pink Lips Booster', description: 'Lip Tone · Hydration · Natural Pink', image: '/assets/img/exp-pink-lips-booster.jpg', link: '/services', buttonLabel: 'Explore Treatment' },
        { title: 'PLLA Biostimulator', description: 'Collagen Boost · Sculptra · Firming', image: '/assets/img/exp-plla-biostimulator.jpg', link: '/services', buttonLabel: 'Explore Treatment' }
      ],
      expertise_more: {
        link: '/services',
        link_text: 'See All Services'
      },

      // Section 4: WHY
      why_eyebrow: 'The Nouvel Age Difference',
      why_title: 'Thirteen Years of',
      why_title_em: 'Trusted Care',
      why_lead: 'Since 2014, Nouvel Age has grown into one of Egypt\'s most trusted aesthetic groups — more than 188,000 patients cared for by a team of 150+ doctors, across Cairo, Giza and Alexandria.',
      why_pillars: [
        { value: '13+', title: 'Years of Excellence', description: 'Trusted since 2014 — over a decade refining aesthetic medicine in Egypt.' },
        { value: '188K+', title: 'Patients Served', description: 'Hundreds of thousands of journeys — and counting — across every discipline.' },
        { value: '150+', title: 'Doctors in the Group', description: 'A large team of board-certified specialists. Your care, never delegated.' },
        { value: '11', title: 'Branches', description: 'Across Cairo, Giza & Alexandria — premium care, always close to you.' }
      ],

      // Section 5: LUXURY BRANCHES
      branches: [
        {
          city: 'Cairo',
          location: 'Citystars - Phase 2',
          address: '3rd Floor, Unit 3280',
          image: '/assets/img/hero-3-branch.jpg'
        },
        {
          city: 'Cairo',
          location: 'Cairo Festival City',
          address: 'CFC · 2nd Floor, Unit 1-08',
          image: '/assets/img/hero-3-branch.jpg'
        },
        {
          city: 'Cairo',
          location: 'Madinaty',
          address: 'The Strip · Building 10, PL02',
          image: '/assets/img/hero-3-branch.jpg'
        },
        {
          city: 'Giza',
          location: 'Mohandessin',
          address: '2 Dr. Mahrouky St. · 3rd Floor',
          image: '/assets/img/Nouvelage-06.jpg'
        },
        {
          city: 'Giza',
          location: 'Sheikh Zayed',
          address: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H',
          image: '/assets/img/Nouvelage-07.jpg'
        },
        {
          city: 'Giza',
          location: 'Mall of Arabia',
          address: 'Gate 17, Unit H052',
          image: '/assets/img/Nouvelage-11.jpg'
        },
        {
          city: 'Alexandria',
          location: 'Camp Shizar',
          address: '18 El Geish Road · opp. Casino El Shatby',
          image: '/assets/img/Nouvelage-12.jpg'
        },
        {
          city: 'Alexandria',
          location: 'Roushdy',
          address: '17 Syria Street',
          image: '/assets/img/Nouvelage-20.jpg'
        },
        {
          city: 'Alexandria',
          location: 'Loran',
          address: 'El Murjan Tower · El Horreya Road',
          image: '/assets/img/Nouvelage-22.jpg'
        }
      ],

      // Section 6: DOCTORS
      doctors_eyebrow: 'Our Medical Team',
      doctors_title: 'Expert Doctors.',
      doctors_title_em: 'Genuine Care.',
      doctors_lead: 'Every treatment is performed by board-certified specialists — never delegated.',
      doctors_all_link: '/team',
      doctor_cards: [
        'doctor-1-id',
        'doctor-2-id',
        'doctor-3-id'
      ],

      // Section 7: REVIEWS
      reviews_eyebrow: 'Patient Stories',
      reviews_title: 'What Patients',
      reviews_title_em: 'Say',
      reviews_lead: 'Real, verified reviews from our patients across Cairo, Giza & Alexandria.',
      reviews_embed_code: '<div id="JFWebsiteWidget-019ec7b9af127bc6afc44dd79d6c04a96649"></div>\n<script src=\'https://www.jotform.com/website-widgets/embed/019ec7b9af127bc6afc44dd79d6c04a96649?v=1.0.0\'></script>',

      // Section 8: INSTAGRAM
      instagram_eyebrow: 'Follow Our Journey',
      instagram_title: 'Life at',
      instagram_title_em: 'Nouvelage',
      instagram_handle: '@nouvelageclinics',
      instagram_handle_link: 'https://www.instagram.com/nouvelageclinics',
      instagram_gallery: [
        { imageUrl: '/assets/img/ig-1.jpg', postLink: 'https://www.instagram.com/p/DYM_vX5jVZE/' },
        { imageUrl: '/assets/img/ig-2.jpg', postLink: 'https://www.instagram.com/p/DYMxEHBDKDJ/' },
        { imageUrl: '/assets/img/ig-3.jpg', postLink: 'https://www.instagram.com/p/DXjAg09DqWL/' },
        { imageUrl: '/assets/img/ig-4.jpg', postLink: 'https://www.instagram.com/p/DXfCU1ujxfU/' },
        { imageUrl: '/assets/img/ig-5.jpg', postLink: 'https://www.instagram.com/p/DXcu7wXDO4T/' },
        { imageUrl: '/assets/img/ig-6.jpg', postLink: 'https://www.instagram.com/p/DWjxsE_jNNL/' }
      ],
      instagram_bar_heading: 'Follow us for tips, results & behind-the-scenes',
      instagram_bar_subtext: '@nouvelageclinics',
      instagram_bar_button_text: 'Follow on Instagram',
      instagram_bar_button_link: 'https://www.instagram.com/nouvelageclinics',

      // Section 9: FAQ
      faq_eyebrow: 'Common Questions',
      faq_title: 'Your Questions,',
      faq_title_em: 'Answered Honestly',
      faq_items: [
        { question: 'Is laser hair removal safe for all skin types?', answer: 'Yes. Our DEKA-certified Italian laser is clinically validated for all Fitzpatrick skin types I through VI — including darker skin tones.' },
        { question: 'How many sessions will I need?', answer: 'Most clients see 80–90% permanent reduction in 6–8 sessions, spaced 4–6 weeks apart. The exact number depends on the area and your individual factors.' },
        { question: 'Is there downtime after treatments?', answer: 'Most of our treatments have minimal downtime. Botox and many fillers allow you to return to normal activities immediately.' }
      ],

      // Section 10: TRUST
      trust_rating: '4.9★',
      trust_rating_text: 'Average Rating · 3,200+ Reviews',
      trust_cert1: 'DEKA™',
      trust_cert1_text: 'Certified Technology',
      trust_cert2: 'ISO',
      trust_cert2_text: 'Accredited Clinic',
      trust_cert3: '3 Cities',
      trust_cert3_text: 'Cairo · Giza · Alexandria',

      // Section 11: SERVICES CTA
      services_cta_eyebrow: 'The Treatment Menu',
      services_cta_title: 'Twenty Treatments.',
      services_cta_title_em: 'One Standard.',
      services_cta_description: 'From laser and injectables to hair restoration and skin rejuvenation — explore the full menu, with details and pricing for every protocol.',
      services_cta_button_text: 'Explore All Services',
      services_cta_button_link: '/services',
      services_cta_bg_image: '/assets/img/cta-bg.jpg',

      // Section 12: CONTACT
      contact_eyebrow: 'Reach Out',
      contact_title: 'Get in',
      contact_title_em: 'Touch',
      contact_lead: 'Visit us, send a message, or chat on WhatsApp — our specialists are ready to start your journey to confident beauty.',
      map_branches: [
        { city: 'Cairo', name: 'Citystars — Phase 2', addr: '3rd Floor, Unit 3280', lat: '30.0726', lng: '31.3478' },
        { city: 'Cairo', name: 'Cairo Festival City', addr: 'CFC · 2nd Floor, Unit 1-08', lat: '30.0290', lng: '31.4080' },
        { city: 'Cairo', name: 'Madinaty', addr: 'The Strip · Building 10, PL02', lat: '30.0997', lng: '31.6469' },
        { city: 'Giza', name: 'Mohandessin', addr: '2 Dr. Mahrouky St. · 3rd Floor', lat: '30.0590', lng: '31.2020' },
        { city: 'Giza', name: 'Sheikh Zayed', addr: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H', lat: '30.0420', lng: '30.9770' },
        { city: 'Giza', name: 'Mall of Arabia', addr: 'Gate 17, Unit H052', lat: '29.9890', lng: '30.9760' },
        { city: 'Alexandria', name: 'Camp Shizar', addr: '18 El Geish Road · opp. Casino El Shatby', lat: '31.2150', lng: '29.9270' },
        { city: 'Alexandria', name: 'Roushdy', addr: '17 Syria Street', lat: '31.2340', lng: '29.9560' },
        { city: 'Alexandria', name: 'Loran', addr: 'El Murjan Tower · El Horreya Road', lat: '31.2640', lng: '29.9930' }
      ],
      contact_hotline_label: 'Hotline',
      contact_hotline: '16823',
      contact_whatsapp_label: 'WhatsApp',
      contact_whatsapp: '+20 100 031 2528',
      contact_email_label: 'Email',
      contact_email: 'info@nouvelageclinic.com',
      contact_hours_label: 'Hours',
      contact_hours: 'Sat–Fri · 10am–10pm',

      // SEO & Meta
      meta_title: 'For Her - Women\'s Aesthetic Treatments | Nouvelage',
      meta_description: 'Explore luxury aesthetic treatments designed exclusively for women at Nouvelage. Advanced skincare, wellness therapies, and beauty solutions.'
    },
    forhim: {
      // Section 1: HERO
      hero_eyebrow: 'Nouvel Age · Cairo · Giza · Alexandria',
      hero_title: 'Modern Grooming Meets',
      hero_title_em: 'Clinical Precision',
      hero_slogan: 'Nouvel Âge, Nouvelle Vie',
      hero_subtitle: 'Refined, results-led aesthetic medicine for men at Nouvel Age — where advanced technology meets discreet, deeply personalized care across skin, injectables, laser and hair.',
      hero_actions: [
        { text: 'Book Consultation', link: '#contact', style: 'gold' },
        { text: 'View Treatments', link: '/services', style: 'light' }
      ],
      hero_stats: [
        { value: '188', suffix: 'K+', label: 'Customers Served' },
        { value: '70', suffix: '+', label: 'Services' },
        { value: '76', suffix: '', label: 'Expert Doctors' },
        { value: '11', suffix: '', label: 'Branches' }
      ],
      hero_slides: [
        '/assets/img/hero-forhim-1.jpg',
        '/assets/img/hero-forhim-2.jpg',
        '/assets/img/hero-forhim-3.jpg'
      ],

      // Section 2: APPROACH
      approach_eyebrow: 'Our Approach',
      approach_title: 'Complete Solutions for',
      approach_title_em: 'Modern Men',
      approach_lead: 'Face, hair, body and lasers — every discipline under one roof, each held to a single, uncompromising standard.',
      approach_grid: [
        { icon: 'hair', title: 'Hair Restoration', description: 'Hair restoration, PRP and growth therapies that rebuild density along the hairline and crown — proven, modern, discreet.', image: '/assets/img/approach/hair-restoration-men.jpg' },
        { icon: 'face', title: 'Face', description: 'Face, hair, body and lasers — every discipline under one roof, each held to a single, uncompromising standard.', image: '/assets/img/approach/facial-treatments-men.jpg' },
        { icon: 'laser', title: 'Lasers', description: 'Advanced laser for hair removal — back, chest and beard line — plus resurfacing and rejuvenation, safe for every skin tone.', image: '/assets/img/approach/laser-treatments-men.jpg' },
        { icon: 'body', title: 'Body', description: 'Face, hair, body and lasers — every discipline under one roof, each held to a single, uncompromising standard.', image: '/assets/img/approach/body-sculpting-men.jpg' }
      ],

      // Section 3: EXPERTISE
      expertise_eyebrow: 'Trending Now',
      expertise_title: 'Popular Treatments',
      expertise_title_em: 'for Men',
      expertise_lead: 'The latest in aesthetic science — the innovations our male clients are asking for most this season, performed by certified specialists.',
      expertise_grid: [
        { title: 'Laser Hair Removal', description: 'Hair Removal · Safe · Effective', image: '/assets/img/exp-hair-transplant.jpg', link: '/services', buttonLabel: 'Explore Treatment' },
        { title: 'New Body Contouring', description: 'Latest Machines · Non-Surgical · Sculpting', image: '/assets/img/exp-beard-enhancement.jpg', link: '/services', buttonLabel: 'Explore Treatment' },
        { title: 'Skin Rejuvenation', description: 'Anti-Aging · Texture · Tone', image: '/assets/img/exp-body-sculpting-men.jpg', link: '/services', buttonLabel: 'Explore Treatment' },
        { title: 'Biostimulator', description: 'Collagen Boost · Firming', image: '/assets/img/exp-skin-rejuvenation-men.jpg', link: '/services', buttonLabel: 'Explore Treatment' }
      ],
      expertise_more: {
        link: '/services',
        link_text: 'See All Services'
      },

      // Section 4: WHY
      why_eyebrow: 'The Nouvel Age Difference',
      why_title: 'Thirteen Years of',
      why_title_em: 'Trusted Excellence',
      why_lead: 'Since 2014, Nouvel Age has grown into one of Egypt\'s most trusted aesthetic groups — more than 188,000 patients cared for by a team of 150+ doctors, across Cairo, Giza and Alexandria.',
      why_pillars: [
        { value: '13+', title: 'Years of Excellence', description: 'Trusted since 2014 — over a decade perfecting men\'s aesthetic treatments in Egypt.' },
        { value: '188K+', title: 'Patients Served', description: 'Hundreds of thousands of satisfied clients across all treatment categories.' },
        { value: '150+', title: 'Doctors in the Group', description: 'A large team of board-certified specialists. Your care, never delegated.' },
        { value: '11', title: 'Branches', description: 'Across Cairo, Giza & Alexandria — premium care, always close to you.' }
      ],

      // Section 5: LUXURY BRANCHES
      branches: [
        {
          city: 'Cairo',
          location: 'Citystars - Phase 2',
          address: '3rd Floor, Unit 3280',
          image: '/assets/img/hero-3-branch.jpg'
        },
        {
          city: 'Cairo',
          location: 'Cairo Festival City',
          address: 'CFC · 2nd Floor, Unit 1-08',
          image: '/assets/img/hero-3-branch.jpg'
        },
        {
          city: 'Cairo',
          location: 'Madinaty',
          address: 'The Strip · Building 10, PL02',
          image: '/assets/img/hero-3-branch.jpg'
        },
        {
          city: 'Giza',
          location: 'Mohandessin',
          address: '2 Dr. Mahrouky St. · 3rd Floor',
          image: '/assets/img/Nouvelage-06.jpg'
        },
        {
          city: 'Giza',
          location: 'Sheikh Zayed',
          address: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H',
          image: '/assets/img/Nouvelage-07.jpg'
        },
        {
          city: 'Giza',
          location: 'Mall of Arabia',
          address: 'Gate 17, Unit H052',
          image: '/assets/img/Nouvelage-11.jpg'
        },
        {
          city: 'Alexandria',
          location: 'Camp Shizar',
          address: '18 El Geish Road · opp. Casino El Shatby',
          image: '/assets/img/Nouvelage-12.jpg'
        },
        {
          city: 'Alexandria',
          location: 'Roushdy',
          address: '17 Syria Street',
          image: '/assets/img/Nouvelage-20.jpg'
        },
        {
          city: 'Alexandria',
          location: 'Loran',
          address: 'El Murjan Tower · El Horreya Road',
          image: '/assets/img/Nouvelage-22.jpg'
        }
      ],

      // Section 6: DOCTORS
      doctors_eyebrow: 'Our Medical Team',
      doctors_title: 'Expert Doctors.',
      doctors_title_em: 'Genuine Care.',
      doctors_lead: 'Every treatment is performed by board-certified specialists — never delegated.',
      doctors_all_link: '/team',
      doctors_all_link_text: 'Show all doctors',
      doctors_featured: [],

      // Section 7: REVIEWS
      reviews_eyebrow: 'Patient Stories',
      reviews_title: 'What Patients',
      reviews_title_em: 'Say',
      reviews_lead: 'Real, verified reviews from our patients across Cairo, Giza & Alexandria.',
      reviews_embed_code: '<div id="JFWebsiteWidget-019ec7b9af127bc6afc44dd79d6c04a96649"></div>\n<script src=\'https://www.jotform.com/website-widgets/embed/019ec7b9af127bc6afc44dd79d6c04a96649?v=1.0.0\'></script>',

      // Section 8: INSTAGRAM
      instagram_eyebrow: 'Follow Our Journey',
      instagram_title: 'Life at',
      instagram_title_em: 'Nouvelage',
      instagram_handle: '@nouvelageclinics',
      instagram_handle_link: 'https://www.instagram.com/nouvelageclinics',
      instagram_gallery: [
        { imageUrl: '/assets/img/ig-1.jpg', postLink: 'https://www.instagram.com/p/DYM_vX5jVZE/' },
        { imageUrl: '/assets/img/ig-2.jpg', postLink: 'https://www.instagram.com/p/DYMxEHBDKDJ/' },
        { imageUrl: '/assets/img/ig-3.jpg', postLink: 'https://www.instagram.com/p/DXjAg09DqWL/' },
        { imageUrl: '/assets/img/ig-4.jpg', postLink: 'https://www.instagram.com/p/DXfCU1ujxfU/' },
        { imageUrl: '/assets/img/ig-5.jpg', postLink: 'https://www.instagram.com/p/DXcu7wXDO4T/' },
        { imageUrl: '/assets/img/ig-6.jpg', postLink: 'https://www.instagram.com/p/DWjxsE_jNNL/' }
      ],
      instagram_bar_heading: 'Follow us for tips, results & behind-the-scenes',
      instagram_bar_subtext: '@nouvelageclinics',
      instagram_bar_button_text: 'Follow on Instagram',
      instagram_bar_button_link: 'https://www.instagram.com/nouvelageclinics',

      // Section 9: FAQ
      faq_eyebrow: 'Common Questions',
      faq_title: 'Your Questions,',
      faq_title_em: 'Answered Honestly',
      faq_items: [
        { question: 'Is laser hair removal safe for all skin types?', answer: 'Yes. Our DEKA-certified Italian laser is clinically validated for all Fitzpatrick skin types I through VI — including darker skin tones.' },
        { question: 'Are your doctors certified for injectables?', answer: 'Absolutely. All injectable treatments at Nouvelage are performed exclusively by our board-certified dermatologists.' },
        { question: 'How do I book a consultation?', answer: 'You can book via WhatsApp, the form below, or by visiting the clinic. First consultations are complimentary and confirm within 2 hours.' }
      ],

      // Section 10: TRUST
      trust_rating: '4.9★',
      trust_rating_text: 'Average Rating · 3,200+ Reviews',
      trust_cert1: 'DEKA™',
      trust_cert1_text: 'Certified Technology',
      trust_cert2: 'ISO',
      trust_cert2_text: 'Accredited Clinic',
      trust_cert3: '3 Cities',
      trust_cert3_text: 'Cairo · Giza · Alexandria',

      // Section 11: SERVICES CTA
      services_cta_eyebrow: 'The Treatment Menu',
      services_cta_title: 'Twenty Treatments.',
      services_cta_title_em: 'One Standard.',
      services_cta_description: 'From laser and injectables to hair restoration and skin rejuvenation — explore the full menu, with details and pricing for every protocol.',
      services_cta_button_text: 'Explore All Services',
      services_cta_button_link: '/services',
      services_cta_bg_image: '/assets/img/cta-bg-men.jpg',

      // Section 12: CONTACT
      contact_eyebrow: 'Reach Out',
      contact_title: 'Get in',
      contact_title_em: 'Touch',
      contact_lead: 'Visit us, send a message, or chat on WhatsApp — our specialists are ready to start your journey to confident, natural-looking results.',
      map_branches: [
        { city: 'Cairo', name: 'Citystars — Phase 2', addr: '3rd Floor, Unit 3280', lat: '30.0726', lng: '31.3478' },
        { city: 'Cairo', name: 'Cairo Festival City', addr: 'CFC · 2nd Floor, Unit 1-08', lat: '30.0290', lng: '31.4080' },
        { city: 'Cairo', name: 'Madinaty', addr: 'The Strip · Building 10, PL02', lat: '30.0997', lng: '31.6469' },
        { city: 'Giza', name: 'Mohandessin', addr: '2 Dr. Mahrouky St. · 3rd Floor', lat: '30.0590', lng: '31.2020' },
        { city: 'Giza', name: 'Sheikh Zayed', addr: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H', lat: '30.0420', lng: '30.9770' },
        { city: 'Giza', name: 'Mall of Arabia', addr: 'Gate 17, Unit H052', lat: '29.9890', lng: '30.9760' },
        { city: 'Alexandria', name: 'Camp Shizar', addr: '18 El Geish Road · opp. Casino El Shatby', lat: '31.2150', lng: '29.9270' },
        { city: 'Alexandria', name: 'Roushdy', addr: '17 Syria Street', lat: '31.2340', lng: '29.9560' },
        { city: 'Alexandria', name: 'Loran', addr: 'El Murjan Tower · El Horreya Road', lat: '31.2640', lng: '29.9930' }
      ],
      contact_hotline_label: 'Hotline',
      contact_hotline: '16823',
      contact_whatsapp_label: 'WhatsApp',
      contact_whatsapp: '+20 100 031 2528',
      contact_email_label: 'Email',
      contact_email: 'info@nouvelageclinic.com',
      contact_hours_label: 'Opening Hours',
      contact_hours: 'Sat–Fri · 10am–10pm',

      // SEO & Meta
      meta_title: 'For Him - Men\'s Aesthetic Treatments | Nouvelage',
      meta_description: 'Premium aesthetic and grooming treatments for men. Advanced hair restoration, skincare, and body sculpting tailored to your needs.'
    },
    'team-page': {
      // Section 1: HERO
      hero_eyebrow: 'Our Expert Team',
      hero_title: 'Meet the Specialists',
      hero_title_em: 'Behind Your Care',
      hero_subtitle: 'Every treatment at Nouvel Age is performed by board-certified doctors — specialists in dermatology, aesthetic medicine, and laser technology who never delegate your care.',
      hero_image: '/assets/img/team-hero.jpg',
      hero_cta_text: 'Book Consultation',
      hero_cta_link: '#contact',

      // Section 2: INTRO
      intro_eyebrow: 'World-Class Expertise',
      intro_title: 'Certified Specialists.',
      intro_title_em: 'Genuine Care.',
      intro_description: 'Our team of 150+ doctors across 11 branches brings decades of combined experience in aesthetic medicine. From dermatology and laser treatments to hair restoration and body contouring — your care is always in expert hands.',
      intro_stats: [
        { value: '150', suffix: '+', label: 'Medical Doctors' },
        { value: '13', suffix: '+', label: 'Years of Excellence' },
        { value: '11', suffix: '', label: 'Branches' },
        { value: '188', suffix: 'K+', label: 'Patients Treated' }
      ],

      // Section 3: DOCTORS GRID
      team_doctors_featured: [], // Array of doctor IDs to display

      // Section 4: CTA
      cta_eyebrow: 'Ready to Begin?',
      cta_title: 'Book Your',
      cta_title_em: 'Consultation Today',
      cta_description: 'Meet with one of our specialists for a personalized consultation. We\'ll discuss your goals, recommend treatments, and create a care plan tailored to you.',
      cta_button_text: 'Schedule Consultation',
      cta_button_link: '/contact',
      cta_bg_image: '/assets/img/team-cta-bg.jpg',

      // SEO & Meta
      meta_title: 'Our Medical Team - Expert Doctors | Nouvelage',
      meta_description: 'Meet our team of 150+ board-certified doctors specializing in aesthetic medicine, dermatology, and laser treatments across Cairo, Giza & Alexandria.',
      meta_keywords: 'aesthetic doctors egypt, dermatologists cairo, laser specialists, hair restoration doctors, medical team nouvelage'
    },
    'blog-page': {
      // Section 1: HERO
      hero_eyebrow: 'Expert Insights',
      hero_title: 'Our',
      hero_title_em: 'Blog',
      hero_subtitle: 'Discover the latest in aesthetic treatments, skincare science, and wellness from our team of specialists.',
      hero_image: '/assets/img/blog-hero.jpg',

      // Section 2: CATEGORIES
      blog_categories: [
        'Skin Care',
        'Laser Treatments',
        'Injectables',
        'Hair Care',
        'Body Contouring',
        'Wellness'
      ],

      // SEO & Meta
      meta_title: 'Beauty & Wellness Blog - Expert Tips | Nouvelage',
      meta_description: 'Expert beauty tips, aesthetic treatment insights, and wellness advice from Nouvelage\'s team of board-certified doctors and specialists.',
      meta_keywords: 'beauty blog egypt, skincare tips, aesthetic treatments blog, wellness advice, nouvelage journal'
    },
    'contact-page': {
      // Section 1: HERO
      hero_eyebrow: 'Get in Touch',
      hero_title: 'Visit Us or',
      hero_title_em: 'Reach Out',
      hero_subtitle: 'Book a consultation, ask a question, or visit one of our 11 branches across Cairo, Giza & Alexandria. We are here to help you begin your aesthetic journey.',
      hero_image: '/assets/img/scene-06-hair.jpg',

      // Section 2: BRANCHES HEADER
      branches_eyebrow: 'Find Us',
      branches_title: 'Our Branches across',
      branches_title_em: 'Cairo, Giza & Alexandria',
      branches_lead: '6 clinics, one standard of care. Choose a branch to see its location, hours and direct line.',

      // Section 2: BRANCHES DATA
      branches: [
        { branch_name: 'Citystars — Phase 2', city: 'Cairo', address: '3rd Floor, Unit 3280', phone: '+20 2 24800800', email: 'citystars@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0726', lng: '31.3478', showInMap: true },
        { branch_name: 'Cairo Festival City', city: 'Cairo', address: 'CFC · 2nd Floor, Unit 1-08', phone: '+20 2 27586800', email: 'cfc@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0290', lng: '31.4080', showInMap: true },
        { branch_name: 'Madinaty', city: 'Cairo', address: 'The Strip · Building 10, PL02', phone: '+20 2 25909900', email: 'madinaty@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0997', lng: '31.6469', showInMap: true },
        { branch_name: 'Mohandessin', city: 'Giza', address: '2 Dr. Mahrouky St. · 3rd Floor', phone: '+20 2 33360360', email: 'mohandessin@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0590', lng: '31.2020', showInMap: true },
        { branch_name: 'Sheikh Zayed', city: 'Giza', address: 'Twin Towers Mall, Bldg D · 5th Fl, Clinic H', phone: '+20 2 38548548', email: 'sheikhzayed@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '30.0420', lng: '30.9770', showInMap: true },
        { branch_name: 'Mall of Arabia', city: 'Giza', address: 'Gate 17, Unit H052', phone: '+20 2 38504040', email: 'mallofarabia@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '29.9890', lng: '30.9760', showInMap: true },
        { branch_name: 'Camp Shizar', city: 'Alexandria', address: '18 El Geish Road · opp. Casino El Shatby', phone: '+20 3 5912020', email: 'campshizar@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '31.2150', lng: '29.9270', showInMap: true },
        { branch_name: 'Roushdy', city: 'Alexandria', address: '17 Syria Street', phone: '+20 3 5450450', email: 'roushdy@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '31.2340', lng: '29.9560', showInMap: true },
        { branch_name: 'Loran', city: 'Alexandria', address: 'El Murjan Tower · El Horreya Road', phone: '+20 3 5970970', email: 'loran@nouvelageclinic.com', hours_weekday: '10:00 AM - 10:00 PM', hours_weekend: '10:00 AM - 10:00 PM', whatsapp: '+20 100 031 2528', lat: '31.2640', lng: '29.9930', showInMap: true }
      ],

      // Section 3: CONTACT DETAILS
      contact_eyebrow: 'Contact Details',
      contact_title: 'Ready to Begin Your',
      contact_title_em: 'Transformation?',
      contact_description: 'Reach out via phone, WhatsApp, email, or visit any of our branches. Our team is ready to answer your questions and schedule your consultation.',

      contact_hotline_label: 'Phone',
      contact_hotline: '16823',

      contact_email_label: 'Email',
      contact_email: 'info@nouvelageclinic.com',

      contact_whatsapp_label: 'WhatsApp',
      contact_whatsapp: '+20 100 031 2528',

      // Section 4: SOCIAL LINKS
      social_links: [
        { platform: 'Instagram', url: 'https://www.instagram.com/nouvelageclinics' },
        { platform: 'Facebook', url: 'https://www.facebook.com/NouvelAgeClinics/' },
        { platform: 'TikTok', url: 'https://www.tiktok.com/@nouvelageclinic' },
        { platform: 'YouTube', url: 'https://www.youtube.com/nouvelageclinics' }
      ],

      // Section 5: FORM SETTINGS
      form_enabled: true,
      form_title: 'Send Us a Message',
      form_description: 'Fill out the form below and we will get back to you within 24 hours.',

      // SEO & Meta
      meta_title: 'Contact Us - Book Your Consultation | Nouvelage',
      meta_description: 'Visit Nouvelage at 11 locations across Cairo, Giza & Alexandria. Book your consultation via phone, WhatsApp, or email. Expert aesthetic care is just a call away.',
      meta_keywords: 'contact nouvelage, book consultation, aesthetic clinic locations cairo, beauty clinic giza, nouvelage branches'
    },
    'bundles-page': {
      eyebrow: 'OUR BUNDLES',
      phead_h1: 'Treatment',
      phead_em: 'Bundles',
      lead: 'Discover our curated treatment bundles designed for comprehensive care',
      contact: {
        title: 'Ready to Begin Your Journey?',
        description: 'Contact us to learn more about our treatment bundles and how they can help you achieve your aesthetic goals.',
        ctaText: 'Book Consultation',
        ctaLink: '/contact'
      },
      meta_title: 'Treatment Bundles - Curated Care Packages | Nouvelage',
      meta_description: 'Explore our comprehensive treatment bundles combining multiple services for optimal results. Book your consultation today.',
      meta_keywords: 'treatment bundles, aesthetic packages, comprehensive care, nouvelage bundles'
    },
    'services-page': {
      // Section 1: HERO SLIDER
      hero_slides: [
        {
          title: 'Laser Hair Removal',
          subtitle: 'DEKA™ Italian Technology · Safe for All Skin Tones',
          background_image: '/assets/img/service-slider-laser.jpg',
          cta_text: 'Learn More',
          cta_link: '#laser-section',
          modal_service_id: 'laser-hair-removal'
        },
        {
          title: 'Dermal Fillers & Injectables',
          subtitle: 'Natural Results · Board-Certified Doctors Only',
          background_image: '/assets/img/service-slider-injectables.jpg',
          cta_text: 'Explore Treatments',
          cta_link: '#injectables-section',
          modal_service_id: 'dermal-fillers'
        },
        {
          title: 'Hair Restoration',
          subtitle: 'PRP · Mesotherapy · Transplant Consultation',
          background_image: '/assets/img/service-slider-hair.jpg',
          cta_text: 'Discover Solutions',
          cta_link: '#hair-section',
          modal_service_id: 'hair-restoration'
        },
        {
          title: 'Body Contouring',
          subtitle: 'Non-Surgical Sculpting · Proven Technology',
          background_image: '/assets/img/service-slider-body.jpg',
          cta_text: 'View Options',
          cta_link: '#body-section',
          modal_service_id: 'body-contouring'
        }
      ],

      // Section 2: INTRO
      intro_eyebrow: 'Our Treatment Menu',
      intro_title: 'Comprehensive Aesthetic',
      intro_title_em: 'Services',
      intro_description: 'From advanced laser treatments to expert injectables, hair restoration to body contouring — explore our full range of aesthetic services, all performed by board-certified specialists using the latest technology.',

      // Section 3: FEATURED SERVICES (IDs of services to display)
      featured_services: [], // Array of service IDs from services management

      // Section 4: WHY CHOOSE US
      why_eyebrow: 'Why Choose Nouvelage',
      why_title: 'Excellence in Every',
      why_title_em: 'Treatment',
      why_features: [
        { icon: 'doctor', title: 'Board-Certified Doctors', description: 'Every treatment performed by qualified specialists, never delegated' },
        { icon: 'tech', title: 'Advanced Technology', description: 'DEKA™ lasers, FDA-approved injectables, cutting-edge equipment' },
        { icon: 'locations', title: '11 Premium Locations', description: 'Convenient access across Cairo, Giza & Alexandria' },
        { icon: 'results', title: 'Proven Results', description: '188,000+ satisfied patients over 13 years of excellence' }
      ],

      // Section 5: CTA
      cta_eyebrow: 'Ready to Begin?',
      cta_title: 'Book Your',
      cta_title_em: 'Consultation',
      cta_description: 'Schedule a personalized consultation with one of our specialists. We\'ll discuss your goals, recommend treatments, and create a care plan tailored to you.',
      cta_button_text: 'Book Appointment',
      cta_button_link: '/contact',
      cta_bg_image: '/assets/img/services-cta-bg.jpg',

      // SEO & Meta
      meta_title: 'Aesthetic Services & Treatments - Full Menu | Nouvelage',
      meta_description: 'Explore Nouvelage\'s comprehensive range of aesthetic services: laser treatments, injectables, hair restoration, body contouring & more. Book your consultation today.',
      meta_keywords: 'aesthetic services egypt, laser hair removal cairo, dermal fillers, hair restoration, body contouring, skin treatments nouvelage'
    },
    services: {
      hero_title: 'Our Services',
      hero_subtitle: 'Excellence in Aesthetic Care',
      hero_image: '/images/services-hero.jpg',
      intro_content: 'Browse our comprehensive range of aesthetic treatments and wellness services, all delivered with the highest standards of care and expertise.',
      meta_title: 'Services - Aesthetic Treatments & Procedures | Nouvelage',
      meta_description: 'Comprehensive range of aesthetic treatments including skincare, wellness therapies, and cosmetic procedures at Egypt\'s premier clinic.'
    },
    team: {
      hero_title: 'Meet Our Team',
      hero_subtitle: 'Expertise You Can Trust',
      hero_image: '/images/team-hero.jpg',
      intro_content: 'Our team of internationally trained professionals brings decades of combined experience in aesthetic medicine and wellness care.',
      meta_title: 'Our Expert Team - Medical Professionals | Nouvelage',
      meta_description: 'Meet our team of internationally trained aesthetic professionals committed to delivering world-class care and results.'
    },
    blog: {
      hero_eyebrow: 'Expert Insights',
      hero_title: 'Our',
      hero_title_em: 'Blog',
      hero_subtitle: 'Discover the latest in aesthetic treatments, skincare science, and wellness from our team of specialists.',
      blog_categories: ['Skincare', 'Treatments', 'Wellness', 'Technology', 'Before & After'],
      meta_title: 'Blog - Beauty Tips & Aesthetic Insights | Nouvelage',
      meta_description: 'Expert beauty tips, aesthetic treatment insights, and wellness advice from Nouvelage\'s team of professionals.'
    },
    contact: {
      hero_title: 'Get in Touch',
      hero_subtitle: 'We\'re Here to Help',
      hero_image: '/images/contact-hero.jpg',
      intro_content: 'Book a consultation or reach out to our team. We\'re here to answer your questions and help you begin your aesthetic journey.',
      phone: '+20 123 456 7890',
      email: 'info@nouvelage.com',
      address: '123 Luxury Avenue\nZamalek, Cairo\nEgypt',
      working_hours: 'Sunday - Thursday: 9:00 AM - 8:00 PM\nFriday - Saturday: 10:00 AM - 6:00 PM',
      meta_title: 'Contact Us - Book Your Consultation | Nouvelage',
      meta_description: 'Contact Nouvelage Aesthetic Clinic to book your consultation. Visit us in Zamalek, Cairo or reach out via phone or email.'
    }
  };

  isDemoModeEnabled(): boolean {
    return this.isDemoMode;
  }

  getDemoToken(): string {
    return 'demo-token-temporary-access';
  }

  getDemoUser() {
    return {
      id: 'demo-user-id',
      email: 'demo@nouvelage.com',
      name: 'Demo Admin',
      role: 'admin'
    };
  }

  getDemoPageContent(page: string): any {
    console.log(`📦 getDemoPageContent('${page}') called - loading from Supabase`);

    // Return default content synchronously as fallback
    // The actual Supabase data will be loaded asynchronously by components
    const defaultContent = this.demoPageContent[page] || {};
    console.log(`📦 Returning default content for '${page}' - components should load from Supabase`);
    return { ...defaultContent };
  }

  updateDemoPageContent(page: string, content: any): void {
    console.log(`💾 updateDemoPageContent('${page}') called - saving to Supabase`);
    console.log(`💾 Content being saved has ${Object.keys(content).length} fields`);

    // Save to Supabase instead of localStorage
    this.adminSupabase.updatePageContent(page, content).subscribe({
      next: (success) => {
        if (success) {
          console.log(`✅ Saved '${page}' to Supabase with ${Object.keys(content).length} fields`);
          // Update in-memory cache
          this.demoPageContent[page] = { ...this.demoPageContent[page], ...content };
        }
      },
      error: (err) => {
        console.error(`❌ Failed to save '${page}' to Supabase:`, err);
      }
    });
  }

  enableDemoMode(): void {
    this.isDemoMode = true;
    console.log('✅ Demo mode enabled');
  }

  disableDemoMode(): void {
    this.isDemoMode = false;
    console.log('❌ Demo mode disabled');
  }

  clearPageCache(page: string): void {
    console.log(`🧹 Page cache cleared for: ${page} (no-op - using Supabase)`);
    // No longer using localStorage
  }

  clearAllCache(): void {
    console.log('🧹 All cache cleared (no-op - using Supabase)');
    // No longer using localStorage
  }

  initializeBundles(): void {
    console.log('📦 initializeBundles called (no-op - loading from Supabase)');
    // No longer needed - bundles load from Supabase
  }
}
