import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  Database,
  Bundle,
  ParentBundle,
  Doctor,
  BlogPost,
  MediaFile,
  Service,
  Branch,
  ContactSubmission,
  PageContent,
  Booking
} from '../models/supabase.types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;
  private supabaseUrl = environment.supabase.url;
  private supabaseKey = environment.supabase.anonKey;

  constructor() {
    // Initialize Supabase client from environment configuration.
    // persistSession + autoRefreshToken (defaults) keep the admin logged in
    // across reloads and make every DB write use the authenticated session.
    this.supabase = createClient<Database>(this.supabaseUrl, this.supabaseKey);
    console.log('✅ Supabase initialized with URL:', this.supabaseUrl);
  }

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Initialize Supabase with your project credentials
   * Call this method from app initialization with your Supabase URL and anon key
   */
  initialize(url: string, key: string): void {
    // Don't recreate the client when nothing changed — recreating would drop
    // the active auth session and detach existing auth listeners.
    if (this.supabase && url === this.supabaseUrl && key === this.supabaseKey) {
      return;
    }
    this.supabaseUrl = url;
    this.supabaseKey = key;
    this.supabase = createClient<Database>(url, key);
    console.log('✅ Supabase initialized');
  }

  // ============================================================================
  // PAGE CONTENT
  // ============================================================================

  getPageContent(pageKey: string): Observable<any | null> {
    return from(
      this.supabase
        .from('page_content')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          console.error(`❌ Supabase error for page '${pageKey}':`, response.error);
          throw response.error;
        }
        console.log(`✅ Loaded page content for '${pageKey}':`, response.data);
        return response.data?.content || response.data || null;
      }),
      catchError(error => {
        console.error(`❌ Error fetching page content for '${pageKey}':`, error);
        return of(null);
      })
    );
  }

  updatePageContent(pageKey: string, content: any): Observable<boolean> {
    return from(
      (this.supabase
        .from('page_content') as any)
        .update({ content })
        .eq('page_key', pageKey)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log(`✅ Page content updated: ${pageKey}`);
        return true;
      }),
      catchError(error => {
        console.error(`Error updating page content for '${pageKey}':`, error);
        return of(false);
      })
    );
  }

  // ============================================================================
  // BUNDLES
  // ============================================================================

  getAllBundles(): Observable<Bundle[]> {
    return from(
      this.supabase
        .from('bundles')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching bundles:', error);
        return of([]);
      })
    );
  }

  getBundleById(id: string): Observable<Bundle | null> {
    return from(
      this.supabase
        .from('bundles')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error(`Error fetching bundle ${id}:`, error);
        return of(null);
      })
    );
  }

  getBundlesByCategory(categoryId: string): Observable<Bundle[]> {
    return from(
      this.supabase
        .from('bundles')
        .select('*')
        .eq('parent_category_id', categoryId)
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching bundles by category:', error);
        return of([]);
      })
    );
  }

  createBundle(bundle: Omit<Bundle, 'created_at' | 'updated_at'>): Observable<Bundle | null> {
    return from(
      (this.supabase
        .from('bundles') as any)
        .insert(bundle)
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Bundle created:', response.data?.card_title);
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating bundle:', error);
        return of(null);
      })
    );
  }

  updateBundle(id: string, updates: Partial<Bundle>): Observable<boolean> {
    return from(
      (this.supabase
        .from('bundles') as any)
        .update(updates)
        .eq('id', id)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Bundle updated:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error updating bundle:', error);
        return of(false);
      })
    );
  }

  deleteBundle(id: string): Observable<boolean> {
    return from(
      this.supabase
        .from('bundles')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Bundle deleted:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error deleting bundle:', error);
        return of(false);
      })
    );
  }

  // ============================================================================
  // PARENT BUNDLES (Categories)
  // ============================================================================

  getAllParentBundles(): Observable<ParentBundle[]> {
    return from(
      this.supabase
        .from('parent_bundles')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching parent bundles:', error);
        return of([]);
      })
    );
  }

  // ============================================================================
  // DOCTORS
  // ============================================================================

  getAllDoctors(): Observable<Doctor[]> {
    return from(
      this.supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return of([]);
      })
    );
  }

  getDoctorById(id: string): Observable<Doctor | null> {
    return from(
      this.supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error(`Error fetching doctor ${id}:`, error);
        return of(null);
      })
    );
  }

  getDoctorBySlug(slug: string): Observable<Doctor | null> {
    return from(
      this.supabase
        .from('doctors')
        .select('*')
        .eq('slug', slug)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error(`Error fetching doctor by slug ${slug}:`, error);
        return of(null);
      })
    );
  }

  createDoctor(doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>): Observable<Doctor | null> {
    return from(
      (this.supabase
        .from('doctors') as any)
        .insert(doctor)
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Doctor created:', response.data?.name);
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating doctor:', error);
        return of(null);
      })
    );
  }

  updateDoctor(id: string, updates: Partial<Doctor>): Observable<boolean> {
    return from(
      (this.supabase
        .from('doctors') as any)
        .update(updates)
        .eq('id', id)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Doctor updated:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error updating doctor:', error);
        return of(false);
      })
    );
  }

  deleteDoctor(id: string): Observable<boolean> {
    return from(
      this.supabase
        .from('doctors')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Doctor deleted:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error deleting doctor:', error);
        return of(false);
      })
    );
  }

  // ============================================================================
  // BLOG POSTS
  // ============================================================================

  getAllBlogPosts(): Observable<BlogPost[]> {
    return from(
      this.supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching blog posts:', error);
        return of([]);
      })
    );
  }

  getBlogPostBySlug(slug: string): Observable<BlogPost | null> {
    return from(
      this.supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      }),
      catchError(error => {
        console.error(`Error fetching blog post by slug ${slug}:`, error);
        return of(null);
      })
    );
  }

  createBlogPost(post: Omit<BlogPost, 'created_at' | 'updated_at'>): Observable<BlogPost | null> {
    return from(
      (this.supabase
        .from('blog_posts') as any)
        .insert(post)
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Blog post created:', response.data?.title);
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating blog post:', error);
        return of(null);
      })
    );
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): Observable<boolean> {
    return from(
      (this.supabase
        .from('blog_posts') as any)
        .update(updates)
        .eq('id', id)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Blog post updated:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error updating blog post:', error);
        return of(false);
      })
    );
  }

  deleteBlogPost(id: string): Observable<boolean> {
    return from(
      this.supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Blog post deleted:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error deleting blog post:', error);
        return of(false);
      })
    );
  }

  // ============================================================================
  // MEDIA LIBRARY
  // ============================================================================

  getAllMedia(): Observable<MediaFile[]> {
    return from(
      this.supabase
        .from('media_library')
        .select('*')
        .order('uploaded_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching media:', error);
        return of([]);
      })
    );
  }

  uploadMedia(file: Omit<MediaFile, 'uploaded_at'>): Observable<MediaFile | null> {
    return from(
      (this.supabase
        .from('media_library') as any)
        .insert(file)
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Media uploaded:', response.data?.filename);
        return response.data;
      }),
      catchError(error => {
        console.error('Error uploading media:', error);
        return of(null);
      })
    );
  }

  deleteMedia(id: string): Observable<boolean> {
    return from(
      this.supabase
        .from('media_library')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        console.log('✅ Media deleted:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error deleting media:', error);
        return of(false);
      })
    );
  }

  // ============================================================================
  // SERVICES
  // ============================================================================

  getAllServices(): Observable<Service[]> {
    return from(
      this.supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching services:', error);
        return of([]);
      })
    );
  }

  // ============================================================================
  // BRANCHES
  // ============================================================================

  getAllBranches(): Observable<Branch[]> {
    return from(
      this.supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching branches:', error);
        return of([]);
      })
    );
  }

  // ============================================================================
  // CONTACT SUBMISSIONS
  // ============================================================================

  submitContactForm(submission: Omit<ContactSubmission, 'id' | 'submitted_at' | 'updated_at' | 'status' | 'notes'>): Observable<boolean> {
    return from(
      (this.supabase
        .from('contact_submissions') as any)
        .insert({ ...submission, status: 'new' })
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Contact form submitted');
        return true;
      }),
      catchError(error => {
        console.error('Error submitting contact form:', error);
        return of(false);
      })
    );
  }

  getAllContactSubmissions(): Observable<ContactSubmission[]> {
    return from(
      this.supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data || [];
      }),
      catchError(error => {
        console.error('Error fetching contact submissions:', error);
        return of([]);
      })
    );
  }

  updateContactSubmission(id: string, updates: Partial<ContactSubmission>): Observable<boolean> {
    return from(
      (this.supabase
        .from('contact_submissions') as any)
        .update(updates)
        .eq('id', id)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        console.log('✅ Contact submission updated:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error updating contact submission:', error);
        return of(false);
      })
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('page_content').select('count').single();
      if (error) throw error;
      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
  }

  /**
   * Get Supabase client for advanced operations
   */
  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }
}
