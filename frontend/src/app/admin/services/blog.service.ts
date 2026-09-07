import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AdminContentService } from './admin-content.service';
import { AdminAuthService } from './admin-auth.service';
import { ContentService } from '../../shared/services/content.service';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  authorImage: string;
  publishDate: string;
  category: string;
  featuredImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  readTime: string;
  relatedPosts: string[]; // Array of post IDs
  // Flattened SEO fields (matches the database schema)
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Blog posts. Reads are context-aware: an anonymous visitor gets the PUBLIC
 * published-posts endpoint; a logged-in admin gets the admin endpoint (which
 * includes drafts). Writes are always admin-only. This keeps the public blog
 * pages from ever touching /api/admin — a 401 there would bounce a visitor
 * to the login screen.
 */
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(
    private adminContent: AdminContentService,
    private adminAuth: AdminAuthService,
    private content: ContentService
  ) {}

  getAllPosts(): Observable<BlogPost[]> {
    if (this.adminAuth.isAuthenticated()) {
      return this.adminContent.getAllBlogPosts();
    }
    // Anonymous: same view Supabase RLS used to give — published posts only.
    return this.getPublishedPosts();
  }

  getPublishedPosts(): Observable<BlogPost[]> {
    return this.content.getAllBlogPosts().pipe(
      map(posts => posts.map(post => this.toCamel(post)))
    );
  }

  getPostById(id: string): Observable<BlogPost | null> {
    return this.getAllPosts().pipe(
      map(posts => posts.find(p => p.id === id) || null)
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    return this.getAllPosts().pipe(
      map(posts => posts.find(p => p.slug === slug) || null)
    );
  }

  getPostsByCategory(category: string): Observable<BlogPost[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.filter(p => p.category === category && p.status === 'published'))
    );
  }

  addPost(post: BlogPost): Observable<any> {
    const timestamp = new Date().toISOString();
    const newPost: BlogPost = {
      ...post,
      id: post.id || this.generateId(),
      slug: post.slug || this.generateSlug(post.title),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    return this.adminContent.createBlogPost(newPost);
  }

  updatePost(id: string, updates: Partial<BlogPost>): Observable<boolean> {
    return this.adminContent.updateBlogPost(id, updates);
  }

  deletePost(id: string): Observable<boolean> {
    return this.adminContent.deleteBlogPost(id);
  }

  generateId(): string {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  getCategories(): Observable<string[]> {
    return this.getAllPosts().pipe(
      map(posts => [...new Set(posts.map(post => post.category).filter(cat => cat))].sort())
    );
  }

  /** Public API rows are snake_case; components expect camelCase. */
  private toCamel(row: any): BlogPost {
    const post: any = {};
    for (const key in row) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      post[camelKey] = row[key];
    }
    return post as BlogPost;
  }
}
