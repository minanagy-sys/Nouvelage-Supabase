import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Admin-specific content service — the REST replacement for the old
 * AdminSupabaseService. Handles all backend CRUD operations for the admin
 * dashboard against /api/admin (JWT attached by the auth interceptor).
 *
 * The API speaks snake_case (matching the database), the dashboard speaks
 * camelCase — the same field mappings the dashboard has always relied on
 * are preserved here.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminContentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ============================================================================
  // BUNDLES MANAGEMENT
  // ============================================================================

  /** Get all bundles (including inactive ones for admin) */
  getAllBundlesForAdmin(): Observable<any[]> {
    return this.rows('bundles');
  }

  createBundle(bundle: any): Observable<any> {
    return this.create('bundles', bundle);
  }

  updateBundle(id: string, updates: any): Observable<boolean> {
    return this.update('bundles', id, updates);
  }

  deleteBundle(id: string): Observable<boolean> {
    return this.remove('bundles', id);
  }

  // ============================================================================
  // PAGE CONTENT MANAGEMENT
  // ============================================================================

  getPageContent(pageKey: string): Observable<any> {
    return this.http.get<{ content: any }>(`${this.apiUrl}/admin/pages/${pageKey}`).pipe(
      map(response => response.content || {})
    );
  }

  updatePageContent(pageKey: string, content: any): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/admin/pages/${pageKey}`, { content }).pipe(
      map(() => true)
    );
  }

  // ============================================================================
  // PARENT BUNDLES (CATEGORIES) MANAGEMENT
  // ============================================================================

  getAllParentBundles(): Observable<any[]> {
    return this.rows('parent-bundles');
  }

  createParentBundle(parentBundle: any): Observable<any> {
    return this.create('parent-bundles', parentBundle);
  }

  updateParentBundle(id: string, updates: any): Observable<boolean> {
    return this.update('parent-bundles', id, updates);
  }

  deleteParentBundle(id: string): Observable<boolean> {
    return this.remove('parent-bundles', id);
  }

  // ============================================================================
  // DOCTORS MANAGEMENT
  // ============================================================================

  getAllDoctors(): Observable<any[]> {
    return this.rows('doctors');
  }

  createDoctor(doctor: any): Observable<any> {
    return this.create('doctors', doctor);
  }

  updateDoctor(id: string, updates: any): Observable<boolean> {
    return this.update('doctors', id, updates);
  }

  deleteDoctor(id: string): Observable<boolean> {
    return this.remove('doctors', id);
  }

  // ============================================================================
  // SERVICES MANAGEMENT
  // ============================================================================

  getAllServices(): Observable<any[]> {
    return this.rows('services');
  }

  createService(service: any): Observable<any> {
    return this.create('services', service);
  }

  updateService(id: string, service: any): Observable<boolean> {
    return this.update('services', id, service);
  }

  deleteService(id: string): Observable<boolean> {
    return this.remove('services', id);
  }

  // ============================================================================
  // BLOG POSTS MANAGEMENT
  // ============================================================================

  /** Get all blog posts (including drafts) */
  getAllBlogPosts(): Observable<any[]> {
    return this.rows('blog-posts');
  }

  /** Get only published blog posts (for frontend) */
  getPublishedBlogPosts(): Observable<any[]> {
    return this.getAllBlogPosts().pipe(
      map(posts => posts.filter(p => p.status === 'published'))
    );
  }

  createBlogPost(post: any): Observable<any> {
    return this.create('blog-posts', post);
  }

  updateBlogPost(id: string, updates: any): Observable<boolean> {
    return this.update('blog-posts', id, updates);
  }

  deleteBlogPost(id: string): Observable<boolean> {
    return this.remove('blog-posts', id);
  }

  // ============================================================================
  // MEDIA LIBRARY MANAGEMENT
  // ============================================================================

  getAllMedia(): Observable<any[]> {
    return this.rows('media');
  }

  uploadMedia(file: any): Observable<any> {
    return this.create('media', file);
  }

  deleteMedia(id: string): Observable<boolean> {
    return this.remove('media', id);
  }

  // ============================================================================
  // BRANCHES MANAGEMENT
  // ============================================================================

  getAllBranches(): Observable<any[]> {
    return this.rows('branches');
  }

  createBranch(branch: any): Observable<any> {
    return this.create('branches', branch);
  }

  updateBranch(id: string, updates: any): Observable<boolean> {
    return this.update('branches', id, updates);
  }

  deleteBranch(id: string): Observable<boolean> {
    return this.remove('branches', id);
  }

  // ============================================================================
  // CONTACT SUBMISSIONS
  // ============================================================================

  getAllContactSubmissions(): Observable<any[]> {
    return this.rows('contact-submissions');
  }

  updateContactSubmission(id: string, updates: any): Observable<boolean> {
    return this.update('contact-submissions', id, updates);
  }

  // ============================================================================
  // GENERIC RESOURCE HELPERS
  // ============================================================================

  private rows(resource: string): Observable<any[]> {
    return this.http.get<{ rows: any[] }>(`${this.apiUrl}/admin/${resource}`).pipe(
      map(response => (response.rows || []).map(row => this.snakeToCamel(row)))
    );
  }

  private create(resource: string, data: any): Observable<any> {
    return this.http.post<{ row: any }>(`${this.apiUrl}/admin/${resource}`, this.camelToSnake(data)).pipe(
      map(response => this.snakeToCamel(response.row))
    );
  }

  private update(resource: string, id: string, data: any): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/admin/${resource}/${id}`, this.camelToSnake(data)).pipe(
      map(() => true)
    );
  }

  private remove(resource: string, id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/admin/${resource}/${id}`).pipe(
      map(() => true)
    );
  }

  /** Persist a full ordering after drag-and-drop. */
  reorder(resource: string, ids: string[]): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/admin/${resource}/reorder`, { ids }).pipe(
      map(() => true)
    );
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Convert snake_case object to camelCase.
   * Includes reverse mappings for legacy compatibility.
   */
  private snakeToCamel(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.snakeToCamel(item));

    // Reverse field mappings (database column name → old field name)
    const reverseMappings: { [key: string]: string } = {
      'long_bio': 'about',
      'is_active': 'active',
      'order_index': 'order',
      'parent_category': 'parentBundleId',
    };

    const newObj: any = {};
    for (const key in obj) {
      if (reverseMappings[key]) {
        newObj[reverseMappings[key]] = obj[key];
      } else {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[camelKey] = obj[key];
      }
    }
    return newObj;
  }

  /**
   * Convert camelCase object to snake_case.
   * Includes special field mappings for legacy compatibility.
   */
  private camelToSnake(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.camelToSnake(item));

    // Special field mappings (old field name → database column name)
    const fieldMappings: { [key: string]: string } = {
      'about': 'long_bio',
      'active': 'is_active',
      'order': 'order_index',
      'parentBundleId': 'parent_category',
    };

    const newObj: any = {};
    for (const key in obj) {
      if (fieldMappings[key]) {
        newObj[fieldMappings[key]] = obj[key];
      } else {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        newObj[snakeKey] = obj[key];
      }
    }
    return newObj;
  }

  /** Clear all localStorage caches */
  clearAllCaches(): void {
    localStorage.removeItem('bundles');
    localStorage.removeItem('parentBundles');
    localStorage.removeItem('blogPosts');
    localStorage.removeItem('doctors');
    localStorage.removeItem('mediaLibrary');
    const pages = ['landing', 'forher', 'forhim', 'services', 'contact', 'blog', 'post', 'team', 'bundles-page'];
    pages.forEach(page => localStorage.removeItem(`demo_page_${page}`));
    console.log('✅ All localStorage caches cleared');
  }
}
