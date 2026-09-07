import { Injectable, inject } from '@angular/core';
import { API_BASE } from '../api-base';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import type {
  Bundle,
  ParentBundle,
  Doctor,
  BlogPost,
  MediaFile,
  Service,
  Branch,
  ContactSubmission
} from '../models/content.types';

/**
 * Public content data service — the REST replacement for the old Supabase
 * client. Method names and return shapes are unchanged, so components read
 * exactly the data they always did; only the transport moved to the
 * Nouvelage API (Express + MySQL).
 *
 * Reads hit the public /api/content endpoints. The handful of write methods
 * are used by the admin dashboard only and hit /api/admin — the auth
 * interceptor attaches the admin JWT to those calls.
 */
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = inject(API_BASE);

  constructor(private http: HttpClient) {}

  // ============================================================================
  // PAGE CONTENT
  // ============================================================================

  getPageContent(pageKey: string): Observable<any | null> {
    return this.http.get<{ content: any }>(`${this.apiUrl}/content/pages/${pageKey}`).pipe(
      map(response => response.content ?? null),
      catchError(error => {
        console.error(`Error fetching page content for '${pageKey}':`, error);
        return of(null);
      })
    );
  }

  updatePageContent(pageKey: string, content: any): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/admin/pages/${pageKey}`, { content }).pipe(
      map(() => true),
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
    return this.http.get<{ bundles: Bundle[] }>(`${this.apiUrl}/content/bundles`).pipe(
      map(response => response.bundles || []),
      catchError(error => {
        console.error('Error fetching bundles:', error);
        return of([]);
      })
    );
  }

  getBundleById(id: string): Observable<Bundle | null> {
    return this.http.get<{ bundle: Bundle }>(`${this.apiUrl}/content/bundles/${id}`).pipe(
      map(response => response.bundle ?? null),
      catchError(error => {
        console.error(`Error fetching bundle ${id}:`, error);
        return of(null);
      })
    );
  }

  getBundlesByCategory(categoryId: string): Observable<Bundle[]> {
    return this.getAllBundles().pipe(
      map(bundles => bundles.filter(b => b.parent_category_id === categoryId))
    );
  }

  createBundle(bundle: Omit<Bundle, 'created_at' | 'updated_at'>): Observable<Bundle | null> {
    return this.http.post<{ row: Bundle }>(`${this.apiUrl}/admin/bundles`, bundle).pipe(
      map(response => response.row ?? null),
      catchError(error => {
        console.error('Error creating bundle:', error);
        return of(null);
      })
    );
  }

  updateBundle(id: string, updates: Partial<Bundle>): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/admin/bundles/${id}`, updates).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating bundle:', error);
        return of(false);
      })
    );
  }

  deleteBundle(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/admin/bundles/${id}`).pipe(
      map(() => true),
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
    return this.http.get<{ parentBundles: ParentBundle[] }>(`${this.apiUrl}/content/parent-bundles`).pipe(
      map(response => response.parentBundles || []),
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
    return this.http.get<{ doctors: Doctor[] }>(`${this.apiUrl}/content/doctors`).pipe(
      map(response => response.doctors || []),
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return of([]);
      })
    );
  }

  getDoctorById(id: string): Observable<Doctor | null> {
    return this.http.get<{ doctor: Doctor }>(`${this.apiUrl}/content/doctors/${id}`).pipe(
      map(response => response.doctor ?? null),
      catchError(error => {
        console.error(`Error fetching doctor ${id}:`, error);
        return of(null);
      })
    );
  }

  getDoctorBySlug(slug: string): Observable<Doctor | null> {
    return this.http.get<{ doctor: Doctor }>(`${this.apiUrl}/content/doctors/${slug}`).pipe(
      map(response => response.doctor ?? null),
      catchError(error => {
        console.error(`Error fetching doctor by slug ${slug}:`, error);
        return of(null);
      })
    );
  }

  createDoctor(doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>): Observable<Doctor | null> {
    return this.http.post<{ row: Doctor }>(`${this.apiUrl}/admin/doctors`, doctor).pipe(
      map(response => response.row ?? null),
      catchError(error => {
        console.error('Error creating doctor:', error);
        return of(null);
      })
    );
  }

  updateDoctor(id: string, updates: Partial<Doctor>): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/admin/doctors/${id}`, updates).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating doctor:', error);
        return of(false);
      })
    );
  }

  deleteDoctor(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/admin/doctors/${id}`).pipe(
      map(() => true),
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
    return this.http.get<{ posts: BlogPost[] }>(`${this.apiUrl}/content/blog`).pipe(
      map(response => response.posts || []),
      catchError(error => {
        console.error('Error fetching blog posts:', error);
        return of([]);
      })
    );
  }

  getBlogPostBySlug(slug: string): Observable<BlogPost | null> {
    return this.http.get<{ post: BlogPost }>(`${this.apiUrl}/content/blog/${slug}`).pipe(
      map(response => response.post ?? null),
      catchError(error => {
        console.error(`Error fetching blog post by slug ${slug}:`, error);
        return of(null);
      })
    );
  }

  createBlogPost(post: Omit<BlogPost, 'created_at' | 'updated_at'>): Observable<BlogPost | null> {
    return this.http.post<{ row: BlogPost }>(`${this.apiUrl}/admin/blog-posts`, post).pipe(
      map(response => response.row ?? null),
      catchError(error => {
        console.error('Error creating blog post:', error);
        return of(null);
      })
    );
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/admin/blog-posts/${id}`, updates).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating blog post:', error);
        return of(false);
      })
    );
  }

  deleteBlogPost(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/admin/blog-posts/${id}`).pipe(
      map(() => true),
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
    return this.http.get<{ rows: MediaFile[] }>(`${this.apiUrl}/admin/media`).pipe(
      map(response => response.rows || []),
      catchError(error => {
        console.error('Error fetching media:', error);
        return of([]);
      })
    );
  }

  uploadMedia(file: Omit<MediaFile, 'uploaded_at'>): Observable<MediaFile | null> {
    return this.http.post<{ row: MediaFile }>(`${this.apiUrl}/admin/media`, file).pipe(
      map(response => response.row ?? null),
      catchError(error => {
        console.error('Error uploading media:', error);
        return of(null);
      })
    );
  }

  deleteMedia(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/admin/media/${id}`).pipe(
      map(() => true),
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
    return this.http.get<{ services: Service[] }>(`${this.apiUrl}/content/services`).pipe(
      map(response => response.services || []),
      catchError(error => {
        console.error('Error fetching services:', error);
        return of([]);
      })
    );
  }

  /** Category/parent pairs used by the services page filter chips. */
  getServiceCategories(): Observable<{ category: string | null; parent_service: string | null }[]> {
    return this.http.get<{ categories: { category: string | null; parent_service: string | null }[] }>(
      `${this.apiUrl}/content/services/categories`
    ).pipe(
      map(response => response.categories || []),
      catchError(error => {
        console.error('Error fetching service categories:', error);
        return of([]);
      })
    );
  }

  // ============================================================================
  // BRANCHES
  // ============================================================================

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<{ branches: Branch[] }>(`${this.apiUrl}/content/branches`).pipe(
      map(response => response.branches || []),
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
    return this.http.post(`${this.apiUrl}/contact`, submission).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error submitting contact form:', error);
        return of(false);
      })
    );
  }

  getAllContactSubmissions(): Observable<ContactSubmission[]> {
    return this.http.get<{ rows: ContactSubmission[] }>(`${this.apiUrl}/admin/contact-submissions`).pipe(
      map(response => response.rows || []),
      catchError(error => {
        console.error('Error fetching contact submissions:', error);
        return of([]);
      })
    );
  }

  updateContactSubmission(id: string, updates: Partial<ContactSubmission>): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/admin/contact-submissions/${id}`, updates).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating contact submission:', error);
        return of(false);
      })
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /** Ping the API — same role the old Supabase connection test had. */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
