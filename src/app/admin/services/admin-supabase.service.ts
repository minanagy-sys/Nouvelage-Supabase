import { Injectable } from '@angular/core';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Observable, from, map } from 'rxjs';

/**
 * Admin-specific Supabase service
 * Handles all backend CRUD operations for admin dashboard
 */
@Injectable({
  providedIn: 'root'
})
export class AdminSupabaseService {
  constructor(private supabase: SupabaseService) {}

  // ============================================================================
  // BUNDLES MANAGEMENT
  // ============================================================================

  /**
   * Get all bundles (including inactive ones for admin)
   */
  getAllBundlesForAdmin(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('bundles')
        .select('*')
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        // Convert snake_case to camelCase
        return (response.data || []).map(b => this.snakeToCamel(b));
      })
    );
  }

  /**
   * Create a new bundle
   */
  createBundle(bundle: any): Observable<any> {
    const snakeBundle = this.camelToSnake(bundle);
    return from(
      this.supabase.getClient()
        .from('bundles')
        .insert(snakeBundle)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.snakeToCamel(response.data);
      })
    );
  }

  /**
   * Update an existing bundle
   */
  updateBundle(id: string, updates: any): Observable<boolean> {
    const snakeUpdates = this.camelToSnake(updates);
    return from(
      this.supabase.getClient()
        .from('bundles')
        // @ts-ignore - Supabase type mismatch with RLS
        .update(snakeUpdates)
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  /**
   * Delete a bundle
   */
  deleteBundle(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('bundles')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // PAGE CONTENT MANAGEMENT
  // ============================================================================

  /**
   * Get page content by page key
   */
  getPageContent(pageKey: string): Observable<any> {
    return from(
      this.supabase.getClient()
        .from('page_content')
        .select('content')
        .eq('page_key', pageKey)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          console.warn(`Page content not found for '${pageKey}', returning empty`);
          return {};
        }
        return response.data?.content || {};
      })
    );
  }

  /**
   * Update page content
   */
  updatePageContent(pageKey: string, content: any): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('page_content')
        .upsert({
          page_key: pageKey,
          content: content
        } as any, {
          onConflict: 'page_key'
        })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log(`✅ Page content updated: ${pageKey}`);
        return true;
      })
    );
  }

  // ============================================================================
  // PARENT BUNDLES (CATEGORIES) MANAGEMENT
  // ============================================================================

  /**
   * Get all parent bundles/categories
   */
  getAllParentBundles(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('parent_bundles')
        .select('*')
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(p => this.snakeToCamel(p));
      })
    );
  }

  /**
   * Create parent bundle
   */
  createParentBundle(parentBundle: any): Observable<any> {
    const snakeData = this.camelToSnake(parentBundle);
    return from(
      this.supabase.getClient()
        .from('parent_bundles')
        .insert(snakeData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.snakeToCamel(response.data);
      })
    );
  }

  /**
   * Update parent bundle
   */
  updateParentBundle(id: string, updates: any): Observable<boolean> {
    const snakeUpdates = this.camelToSnake(updates);
    return from(
      this.supabase.getClient()
        .from('parent_bundles')
        // @ts-ignore - Supabase type mismatch with RLS
        .update(snakeUpdates)
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  /**
   * Delete parent bundle
   */
  deleteParentBundle(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('parent_bundles')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // DOCTORS MANAGEMENT
  // ============================================================================

  /**
   * Get all doctors
   */
  getAllDoctors(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('doctors')
        .select('*')
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(d => this.snakeToCamel(d));
      })
    );
  }

  /**
   * Create doctor
   */
  createDoctor(doctor: any): Observable<any> {
    const snakeData = this.camelToSnake(doctor);
    return from(
      this.supabase.getClient()
        .from('doctors')
        .insert(snakeData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.snakeToCamel(response.data);
      })
    );
  }

  /**
   * Update doctor
   */
  updateDoctor(id: string, updates: any): Observable<boolean> {
    const snakeUpdates = this.camelToSnake(updates);
    return from(
      this.supabase.getClient()
        .from('doctors')
        // @ts-ignore - Supabase type mismatch with RLS
        .update(snakeUpdates)
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // SERVICES MANAGEMENT
  // ============================================================================

  /**
   * Get all services from Supabase
   */
  getAllServices(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('services')
        .select('*')
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Loaded services from Supabase:', response.data?.length);
        // Convert snake_case to camelCase for frontend compatibility
        return (response.data || []).map(s => this.snakeToCamel(s));
      })
    );
  }

  /**
   * Create new service
   */
  createService(service: any): Observable<any> {
    const snakeData = this.camelToSnake(service);
    return from(
      this.supabase.getClient()
        .from('services')
        .insert(snakeData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Service created in Supabase:', response.data);
        return this.snakeToCamel(response.data);
      })
    );
  }

  /**
   * Update existing service
   */
  updateService(id: string, service: any): Observable<boolean> {
    const snakeData = this.camelToSnake(service);
    return from(
      this.supabase.getClient()
        .from('services')
        // @ts-ignore - Supabase type mismatch with RLS
        .update(snakeData)
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Service updated in Supabase:', id);
        return true;
      })
    );
  }

  /**
   * Delete service
   */
  deleteService(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('services')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Service deleted from Supabase:', id);
        return true;
      })
    );
  }

  /**
   * Delete doctor
   */
  deleteDoctor(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('doctors')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // BLOG POSTS MANAGEMENT
  // ============================================================================

  /**
   * Get all blog posts (including drafts)
   */
  getAllBlogPosts(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(p => this.snakeToCamel(p));
      })
    );
  }

  /**
   * Get only published blog posts (for frontend)
   */
  getPublishedBlogPosts(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(p => this.snakeToCamel(p));
      })
    );
  }

  /**
   * Create blog post
   */
  createBlogPost(post: any): Observable<any> {
    const snakeData = this.camelToSnake(post);
    return from(
      this.supabase.getClient()
        .from('blog_posts')
        .insert(snakeData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.snakeToCamel(response.data);
      })
    );
  }

  /**
   * Update blog post
   */
  updateBlogPost(id: string, updates: any): Observable<boolean> {
    const snakeUpdates = this.camelToSnake(updates);
    return from(
      this.supabase.getClient()
        .from('blog_posts')
        // @ts-ignore - Supabase type mismatch with RLS
        .update(snakeUpdates)
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  /**
   * Delete blog post
   */
  deleteBlogPost(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('blog_posts')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // MEDIA LIBRARY MANAGEMENT
  // ============================================================================

  /**
   * Get all media files (without data_url for performance)
   */
  getAllMedia(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('media_library')
        .select('id, filename, path, full_path, type, size, uploaded_at, alt_text')
        .order('uploaded_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(m => this.snakeToCamel(m));
      })
    );
  }

  /**
   * Upload media file
   */
  uploadMedia(file: any): Observable<any> {
    const snakeData = this.camelToSnake(file);
    return from(
      this.supabase.getClient()
        .from('media_library')
        .insert(snakeData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.snakeToCamel(response.data);
      })
    );
  }

  /**
   * Delete media file
   */
  deleteMedia(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('media_library')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // BRANCHES MANAGEMENT
  // ============================================================================

  /**
   * Get all branches
   */
  getAllBranches(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('branches')
        .select('*')
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(b => this.snakeToCamel(b));
      })
    );
  }

  /**
   * Create branch
   */
  createBranch(branch: any): Observable<any> {
    const snakeData = this.camelToSnake(branch);
    return from(
      this.supabase.getClient()
        .from('branches')
        .insert(snakeData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.snakeToCamel(response.data);
      })
    );
  }

  /**
   * Update branch
   */
  updateBranch(id: string, updates: any): Observable<boolean> {
    const snakeUpdates = this.camelToSnake(updates);
    return from(
      this.supabase.getClient()
        .from('branches')
        // @ts-ignore - Supabase type mismatch with RLS
        .update(snakeUpdates)
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  /**
   * Delete branch
   */
  deleteBranch(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from('branches')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // CONTACT SUBMISSIONS
  // ============================================================================

  /**
   * Get all contact submissions
   */
  getAllContactSubmissions(): Observable<any[]> {
    return from(
      this.supabase.getClient()
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(c => this.snakeToCamel(c));
      })
    );
  }

  /**
   * Update contact submission status
   */
  updateContactSubmission(id: string, updates: any): Observable<boolean> {
    const snakeUpdates = this.camelToSnake(updates);
    return from(
      this.supabase.getClient()
        .from('contact_submissions')
        // @ts-ignore - Supabase type mismatch with RLS
        .update(snakeUpdates)
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      })
    );
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Convert snake_case object to camelCase
   * Includes reverse mappings for legacy compatibility
   */
  private snakeToCamel(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.snakeToCamel(item));

    // Reverse field mappings (database column name → old field name)
    const reverseMappings: { [key: string]: string } = {
      'long_bio': 'about', // Map 'long_bio' column back to 'about' field
      'is_active': 'active', // Map 'is_active' column back to 'active' field
      'order_index': 'order', // Map 'order_index' column back to 'order' field
      'parent_category': 'parentBundleId', // Map 'parent_category' VARCHAR column to 'parentBundleId' field
    };

    const newObj: any = {};
    for (const key in obj) {
      // Check if there's a reverse mapping for this field
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
   * Convert camelCase object to snake_case
   * Includes special field mappings for legacy compatibility
   */
  private camelToSnake(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.camelToSnake(item));

    // Special field mappings (old field name → new database column name)
    const fieldMappings: { [key: string]: string } = {
      'about': 'long_bio', // Map 'about' field to 'long_bio' column in database
      'active': 'is_active', // Map 'active' field to 'is_active' column in database
      'order': 'order_index', // Map 'order' field to 'order_index' column in database
      'parentBundleId': 'parent_category', // Map 'parentBundleId' field to 'parent_category' VARCHAR column
    };

    const newObj: any = {};
    for (const key in obj) {
      // Check if there's a special mapping for this field
      if (fieldMappings[key]) {
        newObj[fieldMappings[key]] = obj[key];
      } else {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        newObj[snakeKey] = obj[key];
      }
    }
    return newObj;
  }

  /**
   * Clear all localStorage caches
   */
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
