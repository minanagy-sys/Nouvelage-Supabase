import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminContentService } from './admin-content.service';

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
  // Flattened SEO fields (matches Supabase schema)
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private adminSupabase: AdminContentService) {}

  getAllPosts(): Observable<BlogPost[]> {
    return this.adminSupabase.getAllBlogPosts();
  }

  getPublishedPosts(): Observable<BlogPost[]> {
    // Filter for published posts only
    return this.adminSupabase.getPublishedBlogPosts();
  }

  getPostById(id: string): Observable<BlogPost | null> {
    // Return Observable - components need to subscribe
    return new Observable(observer => {
      this.adminSupabase.getAllBlogPosts().subscribe({
        next: (posts) => {
          const post = posts.find(p => p.id === id) || null;
          observer.next(post);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    return new Observable(observer => {
      this.adminSupabase.getAllBlogPosts().subscribe({
        next: (posts) => {
          const post = posts.find(p => p.slug === slug) || null;
          observer.next(post);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getPostsByCategory(category: string): Observable<BlogPost[]> {
    return new Observable(observer => {
      this.adminSupabase.getAllBlogPosts().subscribe({
        next: (posts) => {
          const filtered = posts.filter(p => p.category === category && p.status === 'published');
          observer.next(filtered);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
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

    return this.adminSupabase.createBlogPost(newPost);
  }

  updatePost(id: string, updates: Partial<BlogPost>): Observable<boolean> {
    return this.adminSupabase.updateBlogPost(id, updates);
  }

  deletePost(id: string): Observable<boolean> {
    return this.adminSupabase.deleteBlogPost(id);
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
    return new Observable(observer => {
      this.getAllPosts().subscribe({
        next: (posts) => {
          const categories = posts.map(post => post.category).filter(cat => cat);
          observer.next([...new Set(categories)].sort());
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
