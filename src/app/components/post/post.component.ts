import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { BlogService, BlogPost as BlogServicePost } from '../../admin/services/blog.service';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
}

interface RelatedPost {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  slug: string = '';
  postId: string = '';

  // Post data
  post: BlogPost = {
    id: '',
    title: 'Blog Post Title',
    category: 'Expert Insights',
    date: 'January 1, 2024',
    author: 'Nouvelage Team',
    readTime: '5 min read',
    image: '',
    excerpt: '',
    content: '<p>Blog post content coming soon...</p>'
  };

  relatedPosts: RelatedPost[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Get post ID from route params or query params
    this.route.params.subscribe(params => {
      this.slug = params['slug'] || '';
      this.postId = params['id'] || params['slug'] || '';

      if (this.postId) {
        this.loadPost(this.postId);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.postId = params['id'];
        this.loadPost(this.postId);
      }
    });

    // Scroll to top when component loads
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  loadPost(postId: string): void {
    // Load post from BlogService
    this.blogService.getPostById(postId).subscribe({
      next: (blogPost) => {
        if (blogPost) {
          this.post = {
            id: blogPost.id,
            title: blogPost.title,
            category: blogPost.category || '',
            date: blogPost.publishDate || '',
            author: blogPost.author || '',
            readTime: blogPost.readTime || '',
            image: blogPost.featuredImage || '',
            excerpt: blogPost.excerpt || '',
            content: blogPost.content || ''
          };
        } else {
          this.loadFallbackPost(postId);
        }
      },
      error: (err) => {
        console.error('Failed to load blog post:', err);
        this.loadFallbackPost(postId);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  loadRelatedPosts(currentId: string, category: string): void {
    // TODO: Replace with actual API call to fetch related posts
    this.relatedPosts = [];
  }

  calculateReadTime(content: string): string {
    if (!content) return '5 min read';
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.post?.title || '');
    window.open(`https://x.com/NouvelAgeClinic?url=${url}&text=${title}`, '_blank');
  }

  shareOnLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  navigateToRelatedPost(postId: string): void {
    this.router.navigate(['/post'], { queryParams: { id: postId } });
  }

  loadFallbackPost(postId: string): void {
      // Fallback to hardcoded posts if not in BlogService (for backward compatibility)
      const posts: { [key: string]: BlogPost } = {
      'laser-hair-removal-egypt': {
        id: 'laser-hair-removal-egypt',
        title: 'Laser Hair Removal in Egypt: Prices, Sessions & How to Choose the Right Clinic',
        category: 'Treatments',
        date: 'January 15, 2026',
        author: 'Dr. Sarah Ahmed',
        readTime: '8 min read',
        image: '/assets/img/scene-06-hair.jpg',
        excerpt: 'Your complete guide to laser hair removal in Egypt — prices, number of sessions, the best devices, and pre/post-care tips.',
        content: `
          <p>Laser hair removal has become one of the most sought-after aesthetic treatments in Egypt, offering a long-term solution to unwanted hair. At Nouvel Âge, we understand that choosing the right clinic and treatment plan is crucial for achieving safe, effective results.</p>

          <h2>Understanding Laser Hair Removal</h2>
          <p>Laser hair removal works by targeting the melanin (pigment) in hair follicles with concentrated light energy. This energy is absorbed by the follicle, damaging it enough to significantly slow future hair growth. The treatment is most effective on dark, coarse hair and works on various body areas including face, arms, legs, bikini line, and underarms.</p>

          <h3>How Many Sessions Do You Need?</h3>
          <p>Most clients require 6-8 sessions for optimal results, spaced 4-6 weeks apart. This is because hair grows in cycles, and laser treatment only affects hair in the active growth phase. Factors affecting the number of sessions include:</p>
          <ul>
            <li>Hair color and thickness</li>
            <li>Skin tone</li>
            <li>Treatment area</li>
            <li>Hormonal factors</li>
            <li>Individual response to treatment</li>
          </ul>

          <h2>Laser Hair Removal Prices in Egypt</h2>
          <p>Prices vary significantly based on the treatment area, technology used, and clinic reputation. At Nouvel Âge, we offer transparent pricing and package deals for multiple sessions. Generally, you can expect:</p>
          <ul>
            <li><strong>Small areas</strong> (upper lip, chin): Starting from 300-600 EGP per session</li>
            <li><strong>Medium areas</strong> (underarms, bikini): 500-1200 EGP per session</li>
            <li><strong>Large areas</strong> (full legs, back): 1500-3500 EGP per session</li>
          </ul>
          <p>Package deals for 6-8 sessions typically offer 15-25% savings compared to individual session pricing.</p>

          <h2>Best Laser Technologies Available</h2>
          <p>At Nouvel Âge, we use state-of-the-art laser systems that are FDA-approved and safe for all skin types:</p>

          <h3>Alexandrite Laser</h3>
          <p>Ideal for lighter skin tones, this laser offers fast treatment times and is particularly effective for large body areas. It targets melanin efficiently while minimizing discomfort.</p>

          <h3>Nd:YAG Laser</h3>
          <p>Perfect for darker skin tones, this laser penetrates deeper into the skin with less risk of hyperpigmentation. It is versatile and safe for all skin types.</p>

          <h3>Diode Laser</h3>
          <p>Excellent for medium to dark skin tones, offering a balance between effectiveness and comfort. This technology is particularly good for treating dense, coarse hair.</p>

          <h2>Pre-Treatment Guidelines</h2>
          <p>To ensure optimal results and minimize side effects, follow these guidelines before your session:</p>
          <ul>
            <li>Avoid sun exposure and tanning for 4 weeks before treatment</li>
            <li>Do not wax, pluck, or use epilators for 6 weeks prior (shaving is allowed)</li>
            <li>Shave the treatment area 24 hours before your appointment</li>
            <li>Avoid using any products with retinol or glycolic acid 3 days before</li>
            <li>Inform your practitioner about any medications or skin conditions</li>
            <li>Stay well-hydrated in the days leading up to treatment</li>
          </ul>

          <h2>Post-Treatment Care</h2>
          <p>Proper aftercare is essential for achieving the best results and preventing complications:</p>
          <ul>
            <li>Apply a cold compress or aloe vera gel to soothe treated areas</li>
            <li>Avoid hot showers, saunas, and steam rooms for 48 hours</li>
            <li>Use SPF 50+ sunscreen daily on treated areas</li>
            <li>Avoid strenuous exercise for 24-48 hours</li>
            <li>Do not wax or pluck between sessions - shaving only</li>
            <li>Keep skin moisturized with fragrance-free products</li>
            <li>Avoid swimming pools with chlorine for 48 hours</li>
          </ul>

          <h2>Choosing the Right Clinic in Egypt</h2>
          <p>When selecting a clinic for laser hair removal, consider these important factors:</p>

          <h3>1. Qualified Practitioners</h3>
          <p>Ensure treatments are performed by licensed dermatologists or trained technicians under medical supervision. At Nouvel Âge, all our practitioners are extensively trained and certified.</p>

          <h3>2. Advanced Technology</h3>
          <p>Choose clinics that invest in the latest FDA-approved laser systems with cooling mechanisms for enhanced comfort and safety.</p>

          <h3>3. Customized Treatment Plans</h3>
          <p>Every client is unique. The best clinics conduct thorough consultations and perform patch tests before creating personalized treatment protocols.</p>

          <h3>4. Hygiene and Safety Standards</h3>
          <p>Verify that the clinic maintains strict sterilization protocols and follows international safety guidelines.</p>

          <h3>5. Transparent Pricing</h3>
          <p>Reputable clinics provide clear pricing information with no hidden costs. Be wary of deals that seem too good to be true.</p>

          <h2>Common Side Effects and How to Manage Them</h2>
          <p>Laser hair removal is generally safe, but some temporary side effects may occur:</p>
          <ul>
            <li><strong>Redness and irritation:</strong> Usually subsides within a few hours</li>
            <li><strong>Mild swelling:</strong> Apply cold compresses</li>
            <li><strong>Temporary pigment changes:</strong> Rare when proper protocols are followed</li>
            <li><strong>Crusting:</strong> Keep area clean and moisturized</li>
          </ul>

          <h2>Why Choose Nouvel Âge for Laser Hair Removal?</h2>
          <p>At Nouvel Âge Aesthetic Clinic, we combine cutting-edge technology with expert care across our locations in Cairo, Giza, and Alexandria. Our dermatologists customize each treatment plan based on your unique skin type, hair characteristics, and aesthetic goals.</p>

          <p>We offer:</p>
          <ul>
            <li>Multiple FDA-approved laser systems for all skin types</li>
            <li>Experienced, certified practitioners</li>
            <li>Comprehensive consultations and patch testing</li>
            <li>Flexible payment options and package deals</li>
            <li>Comfortable, private treatment rooms</li>
            <li>Post-treatment support and follow-up</li>
          </ul>

          <h2>Book Your Consultation Today</h2>
          <p>Ready to experience smooth, hair-free skin? Contact Nouvel Âge to schedule your free consultation. Our team will assess your needs, answer your questions, and create a personalized treatment plan tailored to your goals and budget.</p>

          <p>Call us at <strong>16823</strong> or visit one of our convenient locations across Egypt.</p>

          <h2>Frequently Asked Questions</h2>

          <div style="margin: 2rem 0;">
            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Is laser hair removal painful?</h3>
            <p>Most clients describe the sensation as a quick snap or slight tingling. Modern lasers include cooling mechanisms that minimize discomfort. Pain tolerance varies, but most find it very manageable, especially compared to waxing.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">How long does each session take?</h3>
            <p>Small areas like the upper lip take 5-10 minutes, while larger areas like full legs can take 45-60 minutes. Your practitioner will provide a time estimate during consultation.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can I shave between sessions?</h3>
            <p>Yes, shaving is allowed and even recommended. However, avoid waxing, plucking, or using epilators as these remove the hair follicle that the laser needs to target.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Is laser hair removal safe for dark skin?</h3>
            <p>Yes! With the right technology (Nd:YAG laser), laser hair removal is safe and effective for all skin tones. At Nouvel Âge, we use advanced systems specifically designed for darker skin types.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">When will I see results?</h3>
            <p>You will notice hair shedding 1-2 weeks after your first session. Significant reduction becomes visible after 3-4 sessions. Full results appear after completing the recommended treatment course.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can I get laser hair removal while pregnant?</h3>
            <p>We recommend postponing laser hair removal until after pregnancy and breastfeeding, as hormonal changes can affect hair growth and treatment effectiveness.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">What is the best season for laser hair removal?</h3>
            <p>While treatment is available year-round, many prefer starting in fall or winter to avoid sun exposure. However, with proper sun protection, you can begin treatment any time.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">How do I maintain results after treatment?</h3>
            <p>Most clients enjoy long-lasting results with occasional touch-up sessions once or twice a year. Maintenance needs vary based on individual hormones and hair growth patterns.</p>
          </div>
        `
      },
      'hydrafacial-guide': {
        id: 'hydrafacial-guide',
        title: 'HydraFacial: The Ultimate Guide to Deep Cleansing and Radiant Skin',
        category: 'Skincare',
        date: 'February 2, 2026',
        author: 'Dr. Mona Hassan',
        readTime: '7 min read',
        image: '/assets/img/scene-01-eye-closed.jpg',
        excerpt: 'Discover how HydraFacial works, its benefits for all skin types, and why it has become one of the most popular facial treatments in Egypt.',
        content: `
          <p>HydraFacial has revolutionized facial treatments worldwide, and Egypt is no exception. This medical-grade facial treatment delivers instant results with no downtime, making it perfect for busy professionals and anyone seeking glowing, healthy skin.</p>

          <h2>What is HydraFacial?</h2>
          <p>HydraFacial is a patented, non-invasive skincare treatment that combines cleansing, exfoliation, extraction, hydration, and antioxidant protection all in one session. Unlike traditional facials that can be harsh or leave skin red and irritated, HydraFacial uses a unique vortex-fusion delivery system to deeply cleanse and nourish your skin simultaneously.</p>

          <h3>The HydraFacial Technology</h3>
          <p>The treatment uses a specialized device with multiple handpieces, each designed for specific steps of the facial. The patented vortex technology creates a spiral suction effect that painlessly dislodges impurities while simultaneously delivering serums deep into the skin.</p>

          <h2>The Three-Step HydraFacial Process</h2>

          <h3>Step 1: Cleanse and Peel</h3>
          <p>The treatment begins with gentle exfoliation and resurfacing using a combination of glycolic and salicylic acids. This step removes dead skin cells and opens up pores without causing irritation, revealing a fresh layer of skin underneath.</p>

          <h3>Step 2: Extract and Hydrate</h3>
          <p>Using the unique vortex-extraction technology, the device painlessly removes blackheads, whiteheads, and debris from pores. Simultaneously, it saturates the skin with intense moisturizers to maintain hydration during the extraction process.</p>

          <h3>Step 3: Fuse and Protect</h3>
          <p>The final step involves infusing the skin with antioxidants, peptides, and hyaluronic acid to maximize your glow. These serums are customized based on your specific skin concerns, whether that is aging, hyperpigmentation, or acne.</p>

          <h2>HydraFacial Benefits for Every Skin Type</h2>
          <p>One of the greatest advantages of HydraFacial is its versatility. The treatment can be customized for all skin types and addresses multiple concerns:</p>

          <h3>For Oily and Acne-Prone Skin</h3>
          <ul>
            <li>Deep pore cleansing and extraction</li>
            <li>Reduces excess oil production</li>
            <li>Minimizes active breakouts</li>
            <li>Prevents future acne formation</li>
            <li>Reduces the appearance of enlarged pores</li>
          </ul>

          <h3>For Dry and Dehydrated Skin</h3>
          <ul>
            <li>Intense hydration with hyaluronic acid</li>
            <li>Improves skin texture and softness</li>
            <li>Reduces the appearance of fine lines</li>
            <li>Restores skin barrier function</li>
            <li>Creates a healthy, dewy glow</li>
          </ul>

          <h3>For Aging and Mature Skin</h3>
          <ul>
            <li>Stimulates collagen production</li>
            <li>Reduces fine lines and wrinkles</li>
            <li>Improves skin elasticity and firmness</li>
            <li>Brightens and evens skin tone</li>
            <li>Reduces age spots and sun damage</li>
          </ul>

          <h3>For Sensitive Skin</h3>
          <ul>
            <li>Gentle, non-irritating treatment</li>
            <li>Reduces redness and inflammation</li>
            <li>Strengthens skin barrier</li>
            <li>Calms reactive skin</li>
            <li>No harsh chemicals or abrasion</li>
          </ul>

          <h2>HydraFacial Add-Ons and Boosters</h2>
          <p>At Nouvel Âge, we offer various booster serums to enhance your HydraFacial experience:</p>

          <h3>Brightening Booster</h3>
          <p>Contains alpha-arbutin and vitamin C to reduce hyperpigmentation and create a luminous complexion.</p>

          <h3>Anti-Aging Booster</h3>
          <p>Infused with peptides and growth factors to target fine lines, wrinkles, and loss of firmness.</p>

          <h3>Clarifying Booster</h3>
          <p>Includes salicylic acid and niacinamide to combat acne, reduce inflammation, and minimize pores.</p>

          <h3>LED Light Therapy</h3>
          <p>Can be added post-treatment to enhance results. Red light stimulates collagen, while blue light kills acne-causing bacteria.</p>

          <h3>Lymphatic Drainage</h3>
          <p>A specialized massage technique that reduces puffiness, detoxifies, and sculpts facial contours.</p>

          <h2>What to Expect During Your HydraFacial</h2>
          <p>Your HydraFacial experience at Nouvel Âge begins with a thorough skin analysis by our aesthetic professionals. Here is what a typical session includes:</p>

          <h3>Duration</h3>
          <p>A standard HydraFacial takes 30-45 minutes, while deluxe versions with boosters can take up to 60 minutes.</p>

          <h3>Comfort Level</h3>
          <p>The treatment is completely painless and actually quite relaxing. Most clients describe it as a refreshing, spa-like experience with a gentle suction sensation.</p>

          <h3>Immediate Results</h3>
          <p>You will notice visibly clearer, more radiant skin immediately after your first treatment. Your skin will feel smooth, hydrated, and plump.</p>

          <h3>No Downtime</h3>
          <p>Unlike chemical peels or microdermabrasion, HydraFacial requires zero recovery time. You can apply makeup and return to your regular activities immediately.</p>

          <h2>How Often Should You Get a HydraFacial?</h2>
          <p>For optimal results, we recommend:</p>
          <ul>
            <li><strong>Monthly treatments:</strong> Ideal for maintaining healthy, glowing skin</li>
            <li><strong>Every 2 weeks:</strong> For active acne or significant skin concerns</li>
            <li><strong>Quarterly maintenance:</strong> For those with minimal concerns seeking preventive care</li>
            <li><strong>Before special events:</strong> Get one 1-2 days before for that perfect glow</li>
          </ul>

          <h2>Pre-Treatment Preparation</h2>
          <p>HydraFacial requires minimal preparation, but these tips will enhance your results:</p>
          <ul>
            <li>Avoid harsh exfoliants or retinol 3 days before</li>
            <li>Stay hydrated in the days leading up to treatment</li>
            <li>Arrive with a clean face (we will cleanse again, but it helps)</li>
            <li>Avoid waxing or laser treatments 1 week before</li>
            <li>Inform your provider of any active skin conditions or allergies</li>
          </ul>

          <h2>Post-Treatment Care</h2>
          <p>Maximize your HydraFacial results with these simple aftercare steps:</p>
          <ul>
            <li>Avoid direct sun exposure for 24 hours</li>
            <li>Apply SPF 30+ sunscreen daily</li>
            <li>Use gentle, hydrating skincare products</li>
            <li>Avoid harsh exfoliants for 48 hours</li>
            <li>Stay hydrated by drinking plenty of water</li>
            <li>Avoid heavy makeup for 6-12 hours if possible</li>
          </ul>

          <h2>HydraFacial vs. Other Facial Treatments</h2>

          <h3>HydraFacial vs. Chemical Peels</h3>
          <p>While chemical peels can be effective, they often cause redness, peeling, and require downtime. HydraFacial provides similar exfoliation benefits with immediate, visible results and zero recovery time.</p>

          <h3>HydraFacial vs. Microdermabrasion</h3>
          <p>Microdermabrasion uses physical abrasion to remove dead skin, which can be harsh and uncomfortable. HydraFacial is gentler, more hydrating, and suitable for sensitive skin.</p>

          <h3>HydraFacial vs. Traditional Facials</h3>
          <p>Traditional facials can vary greatly in quality and results. HydraFacial offers consistent, medical-grade treatment with advanced technology that delivers reliable outcomes.</p>

          <h2>Who Should Not Get a HydraFacial?</h2>
          <p>While HydraFacial is safe for most people, you should avoid or postpone treatment if you have:</p>
          <ul>
            <li>Active rash, sunburn, or rosacea flare-up</li>
            <li>Open wounds or infections on the face</li>
            <li>Recent facial surgery (wait 2-4 weeks)</li>
            <li>Active herpes outbreak</li>
            <li>Severe uncontrolled acne (consult dermatologist first)</li>
          </ul>

          <h2>HydraFacial Prices in Egypt</h2>
          <p>At Nouvel Âge, we offer competitive pricing for HydraFacial treatments:</p>
          <ul>
            <li><strong>Classic HydraFacial:</strong> Starting from 1,500 EGP</li>
            <li><strong>Deluxe HydraFacial with Booster:</strong> 2,200-2,800 EGP</li>
            <li><strong>Platinum HydraFacial with LED:</strong> 3,000-3,500 EGP</li>
          </ul>
          <p>Package deals available for multiple sessions with 15-20% savings.</p>

          <h2>Why Choose Nouvel Âge for Your HydraFacial?</h2>
          <p>At Nouvel Âge Aesthetic Clinic, we offer:</p>
          <ul>
            <li>Authentic HydraFacial equipment and serums</li>
            <li>Certified skincare professionals and dermatologists</li>
            <li>Customized treatment protocols</li>
            <li>Luxury, private treatment rooms</li>
            <li>Convenient locations across Cairo, Giza, and Alexandria</li>
            <li>Complimentary skin consultations</li>
          </ul>

          <h2>Book Your HydraFacial Today</h2>
          <p>Experience the transformative power of HydraFacial at Nouvel Âge. Whether you are preparing for a special event or seeking regular skincare maintenance, our team is ready to help you achieve your best skin ever.</p>

          <p>Call <strong>16823</strong> to schedule your appointment or visit any of our branches for a complimentary consultation.</p>

          <h2>Frequently Asked Questions</h2>

          <div style="margin: 2rem 0;">
            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">How soon can I wear makeup after a HydraFacial?</h3>
            <p>You can apply makeup immediately after treatment, though we recommend waiting 6-12 hours to let your skin fully absorb the serums and maximize results.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can HydraFacial help with acne scars?</h3>
            <p>Yes! Regular HydraFacial treatments can improve the appearance of acne scars by promoting cell turnover and collagen production. For deeper scars, we may recommend combining it with other treatments.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Is there any redness after treatment?</h3>
            <p>Unlike chemical peels or microdermabrasion, HydraFacial typically causes no redness. Your skin may appear slightly flushed for 30-60 minutes, but this subsides quickly.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can I get HydraFacial before a big event?</h3>
            <p>Absolutely! HydraFacial is perfect before events. Schedule your treatment 1-2 days before for that radiant, camera-ready glow with no risk of irritation or downtime.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">How does HydraFacial differ from a regular facial?</h3>
            <p>HydraFacial uses patented vortex technology and medical-grade serums to deliver consistent, superior results. Traditional facials rely more on manual techniques and can vary in quality.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can men benefit from HydraFacial?</h3>
            <p>Yes! HydraFacial is excellent for all genders. It helps with razor bumps, ingrown hairs, oily skin, and enlarged pores - common concerns for men.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Will my insurance cover HydraFacial?</h3>
            <p>HydraFacial is considered a cosmetic treatment and typically is not covered by insurance. However, we offer package deals and flexible payment options.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can I combine HydraFacial with other treatments?</h3>
            <p>Yes! HydraFacial pairs well with Botox, fillers, and laser treatments. We can create a comprehensive treatment plan during your consultation.</p>
          </div>
        `
      },
      'botox-fillers-explained': {
        id: 'botox-fillers-explained',
        title: 'Botox vs. Fillers: Understanding the Difference and Choosing What is Right for You',
        category: 'Injectable Treatments',
        date: 'February 10, 2026',
        author: 'Dr. Ahmed Khalil',
        readTime: '10 min read',
        image: '/assets/img/scene-05-right-profile.jpg',
        excerpt: 'Learn the key differences between Botox and dermal fillers, what each treatment addresses, and how to choose the best option for your aesthetic goals.',
        content: `
          <p>Injectable treatments have transformed the field of aesthetic medicine, offering non-surgical solutions for facial rejuvenation. However, many people use the terms "Botox" and "fillers" interchangeably, when in fact, they are very different treatments with distinct purposes. At Nouvel Âge, we help our clients understand these differences to make informed decisions about their aesthetic goals.</p>

          <h2>What is Botox?</h2>
          <p>Botox (botulinum toxin type A) is a neuromodulator that temporarily relaxes muscles responsible for creating dynamic wrinkles. When injected into specific facial muscles, it blocks nerve signals that cause muscle contractions, resulting in smoother, younger-looking skin.</p>

          <h3>How Botox Works</h3>
          <p>Botox works by interrupting the communication between nerves and muscles. When the neurotransmitter acetylcholine is blocked, the targeted muscle cannot contract as forcefully, which reduces the appearance of wrinkles caused by repeated facial expressions.</p>

          <h3>What Botox Treats</h3>
          <p>Botox is ideal for treating dynamic wrinkles - lines that appear due to facial movements and expressions:</p>
          <ul>
            <li><strong>Forehead lines:</strong> Horizontal lines across the forehead</li>
            <li><strong>Frown lines:</strong> Vertical lines between the eyebrows (glabellar lines)</li>
            <li><strong>Crow feet:</strong> Lines radiating from the outer corners of the eyes</li>
            <li><strong>Bunny lines:</strong> Wrinkles on the sides of the nose</li>
            <li><strong>Brow lift:</strong> Subtle elevation of the eyebrows</li>
            <li><strong>Gummy smile:</strong> Reducing excessive gum display when smiling</li>
            <li><strong>Jaw slimming:</strong> Relaxing masseter muscles for a more refined jawline</li>
            <li><strong>Neck bands:</strong> Softening platysmal bands in the neck</li>
          </ul>

          <h3>Botox Treatment Timeline</h3>
          <ul>
            <li><strong>Results appear:</strong> 3-7 days after injection</li>
            <li><strong>Peak effect:</strong> 10-14 days</li>
            <li><strong>Duration:</strong> 3-4 months on average</li>
            <li><strong>Maintenance:</strong> Treatments typically every 3-4 months</li>
          </ul>

          <h2>What are Dermal Fillers?</h2>
          <p>Dermal fillers are gel-like substances injected beneath the skin to restore lost volume, smooth wrinkles, and enhance facial contours. Unlike Botox, which relaxes muscles, fillers physically fill spaces under the skin to create a fuller, more youthful appearance.</p>

          <h3>Types of Dermal Fillers</h3>

          <h4>Hyaluronic Acid Fillers</h4>
          <p>The most popular type, including brands like Juvederm, Restylane, and Belotero. Hyaluronic acid (HA) is a naturally occurring substance in the body that attracts and retains moisture. HA fillers are reversible and provide natural-looking results.</p>

          <h4>Calcium Hydroxylapatite Fillers</h4>
          <p>Found in brands like Radiesse, these fillers are thicker in consistency and ideal for deeper wrinkles and volume loss. They also stimulate natural collagen production.</p>

          <h4>Poly-L-lactic Acid Fillers</h4>
          <p>Sculptra is a collagen stimulator that works gradually over time, providing subtle, natural results that can last up to 2 years.</p>

          <h3>What Fillers Treat</h3>
          <p>Fillers address static wrinkles and volume loss:</p>
          <ul>
            <li><strong>Nasolabial folds:</strong> Lines running from nose to mouth corners</li>
            <li><strong>Marionette lines:</strong> Lines from mouth corners downward</li>
            <li><strong>Lip enhancement:</strong> Adding volume, definition, and hydration</li>
            <li><strong>Cheek augmentation:</strong> Restoring midface volume</li>
            <li><strong>Under-eye hollows:</strong> Treating tear troughs and dark circles</li>
            <li><strong>Jawline contouring:</strong> Defining and sharpening the jaw</li>
            <li><strong>Chin augmentation:</strong> Creating better facial balance</li>
            <li><strong>Temple hollowing:</strong> Restoring volume to sunken temples</li>
            <li><strong>Hand rejuvenation:</strong> Adding volume to aging hands</li>
          </ul>

          <h3>Filler Treatment Timeline</h3>
          <ul>
            <li><strong>Results appear:</strong> Immediately, with final results in 2 weeks</li>
            <li><strong>Duration:</strong> 6-24 months depending on product and area</li>
            <li><strong>Maintenance:</strong> Varies by individual and treatment area</li>
          </ul>

          <h2>Key Differences Between Botox and Fillers</h2>

          <table style="width:100%; border-collapse: collapse; margin: 2rem 0;">
            <thead>
              <tr style="background: var(--sand); border-bottom: 2px solid var(--line);">
                <th style="padding: 1rem; text-align: left;">Aspect</th>
                <th style="padding: 1rem; text-align: left;">Botox</th>
                <th style="padding: 1rem; text-align: left;">Dermal Fillers</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--line-soft);">
                <td style="padding: 1rem;"><strong>Mechanism</strong></td>
                <td style="padding: 1rem;">Relaxes muscles</td>
                <td style="padding: 1rem;">Adds volume</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--line-soft);">
                <td style="padding: 1rem;"><strong>Best For</strong></td>
                <td style="padding: 1rem;">Dynamic wrinkles</td>
                <td style="padding: 1rem;">Static wrinkles & volume loss</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--line-soft);">
                <td style="padding: 1rem;"><strong>Results Timeline</strong></td>
                <td style="padding: 1rem;">3-7 days</td>
                <td style="padding: 1rem;">Immediate</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--line-soft);">
                <td style="padding: 1rem;"><strong>Duration</strong></td>
                <td style="padding: 1rem;">3-4 months</td>
                <td style="padding: 1rem;">6-24 months</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--line-soft);">
                <td style="padding: 1rem;"><strong>Reversibility</strong></td>
                <td style="padding: 1rem;">No (wears off naturally)</td>
                <td style="padding: 1rem;">Yes (HA fillers can be dissolved)</td>
              </tr>
              <tr>
                <td style="padding: 1rem;"><strong>Common Areas</strong></td>
                <td style="padding: 1rem;">Forehead, eyes, between brows</td>
                <td style="padding: 1rem;">Lips, cheeks, nasolabial folds</td>
              </tr>
            </tbody>
          </table>

          <h2>Can You Combine Botox and Fillers?</h2>
          <p>Absolutely! In fact, combining Botox and fillers often produces the most natural and comprehensive results. This approach is sometimes called a "liquid facelift." Here is how they work together:</p>

          <h3>The Upper Face</h3>
          <ul>
            <li><strong>Botox:</strong> Smooths forehead lines, frown lines, and crow feet</li>
            <li><strong>Fillers:</strong> Restore volume to temples and under eyes</li>
          </ul>

          <h3>The Mid Face</h3>
          <ul>
            <li><strong>Botox:</strong> Can help with bunny lines on the nose</li>
            <li><strong>Fillers:</strong> Add volume to cheeks and reduce nasolabial folds</li>
          </ul>

          <h3>The Lower Face</h3>
          <ul>
            <li><strong>Botox:</strong> Soften marionette lines and slim the jawline</li>
            <li><strong>Fillers:</strong> Enhance lips, define jawline, and augment chin</li>
          </ul>

          <h2>How to Choose: Botox vs. Fillers</h2>

          <h3>Choose Botox If:</h3>
          <ul>
            <li>Your wrinkles appear mainly when you make facial expressions</li>
            <li>You want to prevent wrinkles from becoming deeper</li>
            <li>Your concerns are in the upper third of the face</li>
            <li>You want to achieve a subtle brow lift</li>
            <li>You are treating excessive sweating or teeth grinding</li>
          </ul>

          <h3>Choose Fillers If:</h3>
          <ul>
            <li>You have visible wrinkles even at rest</li>
            <li>You want to restore lost facial volume</li>
            <li>You want to enhance features like lips or cheeks</li>
            <li>You have hollow under-eyes or sunken temples</li>
            <li>You want longer-lasting results</li>
          </ul>

          <h3>Consider Both If:</h3>
          <ul>
            <li>You have both dynamic and static wrinkles</li>
            <li>You want comprehensive facial rejuvenation</li>
            <li>You are looking for a non-surgical facelift effect</li>
            <li>You want to address multiple concerns in one visit</li>
          </ul>

          <h2>What to Expect During Treatment</h2>

          <h3>Pre-Treatment Consultation</h3>
          <p>At Nouvel Âge, every injectable treatment begins with a thorough consultation. Our experienced practitioners will:</p>
          <ul>
            <li>Assess your facial anatomy and skin quality</li>
            <li>Discuss your aesthetic goals and concerns</li>
            <li>Review your medical history and any contraindications</li>
            <li>Create a customized treatment plan</li>
            <li>Explain expected results and potential side effects</li>
            <li>Answer all your questions</li>
          </ul>

          <h3>During the Procedure</h3>
          <p><strong>Botox:</strong> Takes 10-15 minutes. Multiple small injections with a tiny needle. Minimal discomfort.</p>
          <p><strong>Fillers:</strong> Takes 15-45 minutes depending on areas treated. May include numbing cream or nerve blocks. Some fillers contain lidocaine for comfort.</p>

          <h3>After Treatment</h3>
          <p>Both procedures require minimal to no downtime. You can return to normal activities immediately, though we recommend:</p>
          <ul>
            <li>Avoiding strenuous exercise for 24 hours</li>
            <li>Not lying down flat for 4 hours after Botox</li>
            <li>Avoiding excessive heat or cold for 48 hours</li>
            <li>Not massaging treated areas unless instructed</li>
            <li>Staying hydrated and avoiding alcohol for 24 hours</li>
          </ul>

          <h2>Potential Side Effects</h2>

          <h3>Botox Side Effects (Usually Mild and Temporary)</h3>
          <ul>
            <li>Mild redness or swelling at injection sites</li>
            <li>Temporary headache (rare)</li>
            <li>Slight bruising</li>
            <li>Temporary eyelid drooping (very rare with experienced injector)</li>
          </ul>

          <h3>Filler Side Effects (Usually Mild and Temporary)</h3>
          <ul>
            <li>Swelling and bruising (more common than with Botox)</li>
            <li>Temporary lumps or firmness</li>
            <li>Redness at injection sites</li>
            <li>Rare: allergic reaction, vascular occlusion (extremely rare)</li>
          </ul>

          <h2>Cost Considerations in Egypt</h2>
          <p>Pricing varies based on the amount of product needed and treatment areas:</p>

          <h3>Botox Pricing</h3>
          <ul>
            <li><strong>Per unit:</strong> 60-120 EGP</li>
            <li><strong>Forehead:</strong> Typically 10-30 units (600-3,600 EGP)</li>
            <li><strong>Crow feet:</strong> 5-15 units per side (600-3,600 EGP)</li>
            <li><strong>Frown lines:</strong> 15-25 units (900-3,000 EGP)</li>
          </ul>

          <h3>Filler Pricing</h3>
          <ul>
            <li><strong>Per syringe:</strong> 3,000-8,000 EGP depending on brand</li>
            <li><strong>Lips:</strong> Typically 1 syringe</li>
            <li><strong>Cheeks:</strong> 1-2 syringes per side</li>
            <li><strong>Nasolabial folds:</strong> 1-2 syringes total</li>
          </ul>

          <h2>Choosing the Right Practitioner</h2>
          <p>The skill and experience of your injector is crucial for safe, natural-looking results. At Nouvel Âge, all injectable treatments are performed by board-certified dermatologists or highly trained aesthetic practitioners under medical supervision.</p>

          <h3>What to Look For</h3>
          <ul>
            <li><strong>Qualifications:</strong> Medical degree with specialized training in aesthetic injectables</li>
            <li><strong>Experience:</strong> Extensive practice with various injection techniques</li>
            <li><strong>Artistry:</strong> Understanding of facial anatomy and aesthetic proportions</li>
            <li><strong>Safety protocols:</strong> Use of authentic products and sterile technique</li>
            <li><strong>Realistic expectations:</strong> Honest about what can be achieved</li>
            <li><strong>Emergency preparedness:</strong> Equipped to handle rare complications</li>
          </ul>

          <h2>Maintaining Your Results</h2>

          <h3>For Botox</h3>
          <ul>
            <li>Schedule treatments every 3-4 months</li>
            <li>Use quality skincare with sunscreen daily</li>
            <li>Stay hydrated</li>
            <li>Consider starting earlier for prevention (late 20s to early 30s)</li>
          </ul>

          <h3>For Fillers</h3>
          <ul>
            <li>Touch-up treatments as needed (varies by product and area)</li>
            <li>Maintain skin health with regular facials and skincare</li>
            <li>Protect skin from sun damage</li>
            <li>Stay well-hydrated (especially for HA fillers)</li>
          </ul>

          <h2>Why Choose Nouvel Âge for Your Injectable Treatments?</h2>
          <p>At Nouvel Âge Aesthetic Clinic, we offer:</p>
          <ul>
            <li>Board-certified dermatologists with extensive injectable experience</li>
            <li>Only authentic, FDA-approved products</li>
            <li>Customized treatment plans for natural-looking results</li>
            <li>Advanced injection techniques for minimal discomfort</li>
            <li>Comprehensive consultations and aftercare</li>
            <li>Convenient locations across Cairo, Giza, and Alexandria</li>
            <li>Emergency protocols and follow-up care</li>
          </ul>

          <h2>Book Your Consultation</h2>
          <p>Ready to discover which injectable treatment is right for you? Schedule a complimentary consultation at Nouvel Âge. Our expert team will assess your unique facial features and aesthetic goals to create a personalized treatment plan that delivers natural, beautiful results.</p>

          <p>Call <strong>16823</strong> or visit any of our branches to begin your journey to a more refreshed, youthful appearance.</p>

          <h2>Frequently Asked Questions</h2>

          <div style="margin: 2rem 0;">
            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">At what age should I start getting Botox?</h3>
            <p>Many people start preventive Botox in their late 20s to early 30s. However, the best age depends on when you notice dynamic wrinkles forming. A consultation can help determine the right timing for you.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Will my face look frozen after Botox?</h3>
            <p>When administered properly by an experienced injector, Botox should create natural-looking results with preserved facial expressions. The "frozen" look only occurs with excessive dosing or poor technique.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can filler migration happen?</h3>
            <p>Migration is rare when fillers are injected by qualified practitioners using proper techniques. Modern HA fillers are formulated to stay in place. If migration occurs, it can be corrected.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">How long until I can exercise after injections?</h3>
            <p>Avoid strenuous exercise for 24 hours after both Botox and fillers. This helps prevent swelling and ensures optimal product placement.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can I dissolve fillers if I dont like them?</h3>
            <p>Yes! Hyaluronic acid fillers can be dissolved with hyaluronidase enzyme if needed. This provides peace of mind and makes HA fillers a reversible option.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Will I need more product over time?</h3>
            <p>Not necessarily. With consistent treatment, you may actually need less Botox as muscles become trained to relax. For fillers, maintenance needs vary by individual and treatment area.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Do injectable treatments hurt?</h3>
            <p>Most patients tolerate both treatments well. Botox uses very fine needles and is quick. Fillers may cause more discomfort, but numbing cream or nerve blocks minimize this.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Can I get Botox and fillers on the same day?</h3>
            <p>Yes! Many patients combine treatments in one appointment for comprehensive facial rejuvenation. Your practitioner will create a customized treatment plan.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">Are there any long-term side effects?</h3>
            <p>When administered by qualified practitioners, both Botox and fillers have excellent long-term safety records. Serious complications are extremely rare.</p>

            <h3 style="color: var(--gold-d); margin-top: 1.5rem;">How do I choose between Botox and fillers?</h3>
            <p>Schedule a consultation at Nouvel Âge. We will assess your concerns, examine your facial anatomy, and recommend the best treatment approach for your goals.</p>
          </div>
        `
      }
    };

    const postData = posts[postId];
    if (postData) {
      this.post = postData;
    }
  }
}
