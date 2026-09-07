import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CartFlyoutComponent } from '../../shared/components/cart-flyout/cart-flyout.component';
import { DemoModeService } from '../../admin/services/demo-mode.service';
import { BlogService } from '../../admin/services/blog.service';
import { SupabaseService } from '../../shared/services/supabase.service';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartFlyoutComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  cartCount: number = 0;
  pageContent: any = {};
  blogPosts: BlogPost[] = [
    {
      id: 'laser-hair-removal-egypt',
      title: 'Laser Hair Removal in Egypt: Prices, Sessions & How to Choose the Right Clinic',
      excerpt: 'Your complete guide to laser hair removal in Egypt — prices, number of sessions, the best devices, and pre/post-care tips. Book at Nouvel Âge today.',
      image: '/assets/img/scene-06-hair.jpg',
      date: 'January 15, 2026'
    },
    {
      id: 'hydrafacial-guide',
      title: 'HydraFacial: The Ultimate Guide to Deep Cleansing and Radiant Skin',
      excerpt: 'Discover how HydraFacial works, its benefits for all skin types, and why it has become one of the most popular facial treatments in Egypt.',
      image: '/assets/img/scene-01-eye-closed.jpg',
      date: 'February 2, 2026'
    },
    {
      id: 'botox-fillers-explained',
      title: 'Botox vs. Fillers: Understanding the Difference and Choosing What is Right for You',
      excerpt: 'Learn the key differences between Botox and dermal fillers, what each treatment addresses, and how to choose the best option for your aesthetic goals.',
      image: '/assets/img/scene-05-right-profile.jpg',
      date: 'February 10, 2026'
    }
  ];

  constructor(
    private router: Router,
    private demoModeService: DemoModeService,
    private blogService: BlogService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    // Load page content from backend
    this.pageContent = this.demoModeService.getDemoPageContent('blog-page');

    // Migrate hardcoded posts to BlogService if needed (one-time migration)
    this.migrateHardcodedPosts();

    // Load published blog posts from BlogService
    this.blogService.getPublishedPosts().subscribe({
      next: (publishedPosts) => {
        if (publishedPosts && publishedPosts.length > 0) {
          // Map full BlogPost to display BlogPost format
          this.blogPosts = publishedPosts.map((post: any) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            image: post.featuredImage || post.featured_image,
            date: this.formatDate(post.publishDate || post.publish_date),
            category: post.category
          }));
          console.log('✅ Loaded', this.blogPosts.length, 'published blog posts');
        } else {
          console.log('⚠️ No published blog posts found, using hardcoded fallback');
        }
      },
      error: (err) => {
        console.error('Failed to load blog posts:', err);
        console.log('⚠️ Using hardcoded fallback due to error');
      }
    });
  }

  migrateHardcodedPosts(): void {
    // Check if posts have already been migrated
    this.blogService.getAllPosts().subscribe({
      next: (existingPosts) => {
        if (existingPosts.length > 0) {
          console.log('📦 Blog posts already exist in database, skipping migration');
          return;
        }
        this.performMigration();
      },
      error: (err) => {
        console.error('Failed to check existing posts:', err);
      }
    });
  }

  performMigration(): void {

    console.log('🔄 Migrating hardcoded blog posts to database...');

    // Migrate the 3 hardcoded posts with their original data
    const postsToMigrate = [
      {
        id: 'laser-hair-removal-egypt',
        slug: 'laser-hair-removal-egypt',
        title: 'Laser Hair Removal in Egypt: Prices, Sessions & How to Choose the Right Clinic',
        subtitle: 'Your Complete Guide to Laser Hair Removal',
        author: 'Dr. Randa El Aguizy',
        authorImage: '/assets/img/team/dr-randa.jpg',
        publishDate: '2026-01-15',
        category: 'Laser Treatments',
        featuredImage: '/assets/img/scene-06-hair.jpg',
        excerpt: 'Your complete guide to laser hair removal in Egypt — prices, number of sessions, the best devices, and pre/post-care tips. Book at Nouvel Âge today.',
        content: '',
        tags: ['Laser', 'Hair Removal', 'Egypt'],
        status: 'published' as const,
        readTime: '8 min read',
        relatedPosts: [],
        seo: {
          metaTitle: 'Laser Hair Removal Egypt: Complete Guide 2026',
          metaDescription: 'Complete guide to laser hair removal in Egypt - prices, sessions, best devices.',
          metaKeywords: 'laser hair removal egypt, laser treatment'
        },
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString()
      },
      {
        id: 'hydrafacial-guide',
        slug: 'hydrafacial-guide',
        title: 'HydraFacial: The Ultimate Guide to Deep Cleansing and Radiant Skin',
        subtitle: 'Discover the Power of HydraFacial',
        author: 'Dr. Poussy Maher',
        authorImage: '/assets/img/team/dr-poussy.jpg',
        publishDate: '2026-02-02',
        category: 'Skin Care',
        featuredImage: '/assets/img/scene-01-eye-closed.jpg',
        excerpt: 'Discover how HydraFacial works, its benefits for all skin types, and why it has become one of the most popular facial treatments in Egypt.',
        content: '',
        tags: ['HydraFacial', 'Skin Care', 'Facial'],
        status: 'published' as const,
        readTime: '6 min read',
        relatedPosts: [],
        seo: {
          metaTitle: 'HydraFacial Guide: Deep Cleansing & Radiant Skin',
          metaDescription: 'Learn how HydraFacial works and why it is the most popular facial treatment.',
          metaKeywords: 'hydrafacial, facial treatment, skin care'
        },
        createdAt: new Date('2026-02-02').toISOString(),
        updatedAt: new Date('2026-02-02').toISOString()
      },
      {
        id: 'botox-fillers-explained',
        slug: 'botox-fillers-explained',
        title: 'Botox vs. Fillers: Understanding the Difference and Choosing What is Right for You',
        subtitle: 'Making the Right Choice for Your Aesthetic Goals',
        author: 'Dr. Randa El Aguizy',
        authorImage: '/assets/img/team/dr-randa.jpg',
        publishDate: '2026-02-10',
        category: 'Injectables',
        featuredImage: '/assets/img/scene-05-right-profile.jpg',
        excerpt: 'Learn the key differences between Botox and dermal fillers, what each treatment addresses, and how to choose the best option for your aesthetic goals.',
        content: '',
        tags: ['Botox', 'Fillers', 'Injectables'],
        status: 'published' as const,
        readTime: '7 min read',
        relatedPosts: [],
        seo: {
          metaTitle: 'Botox vs Fillers: Complete Comparison Guide 2026',
          metaDescription: 'Understand the difference between Botox and fillers.',
          metaKeywords: 'botox, fillers, dermal fillers, injectables'
        },
        createdAt: new Date('2026-02-10').toISOString(),
        updatedAt: new Date('2026-02-10').toISOString()
      }
    ];

    postsToMigrate.forEach(post => {
      this.blogService.addPost(post).subscribe({
        next: () => console.log(`✅ Migrated post: ${post.title}`),
        error: (err) => console.error(`Failed to migrate post: ${post.title}`, err)
      });
    });

    console.log('🔄 Migrating 3 blog posts to database...');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
