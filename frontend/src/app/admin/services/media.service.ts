import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminAuthService } from './admin-auth.service';

/**
 * Media upload service. Files go to the Nouvelage API, which converts every
 * image to WebP, writes 480/768/1200 responsive variants, and files it by
 * department → entity → semantic name:
 *
 *   /assets/img/media-library/doctors/{doctor-slug}/profile.webp
 *   /assets/img/media-library/doctors/{doctor-slug}/case-3-face-before.webp
 *   /assets/img/media-library/pages/{page-name}/{image-type}.webp
 *
 * Every method returns the canonical web path — image bytes never enter the
 * database.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private uploadUrl = `${environment.apiUrl}/admin/media/upload`;

  constructor(private adminAuthService: AdminAuthService) {}

  /** Saves a doctor profile image and returns the file path. */
  async saveDoctorProfile(file: File, doctorSlug: string): Promise<string> {
    return this.uploadFile(file, 'doctors', doctorSlug, 'profile');
  }

  /** Saves a doctor before/after case image and returns the file path. */
  async saveCaseImage(file: File, doctorSlug: string, caseNumber: number, type: 'before' | 'after', category: string = ''): Promise<string> {
    const categorySlug = this.slugify(category) || 'treatment';
    return this.uploadFile(file, 'doctors', doctorSlug, `case-${caseNumber}-${categorySlug}-${type}`);
  }

  /** Saves a page image (hero, background, etc.) and returns the file path. */
  async savePageImage(file: File, pageName: string, imageType: string): Promise<string> {
    return this.uploadFile(file, 'pages', pageName, imageType);
  }

  /** Saves a blog post image and returns the file path. */
  async saveBlogImage(file: File, postSlug: string, imageType: string = 'image'): Promise<string> {
    return this.uploadFile(file, 'blog', postSlug, `${imageType}-${Date.now()}`);
  }

  /** Saves a blog featured image and returns the file path. */
  async saveBlogFeaturedImage(file: File, postSlug: string): Promise<string> {
    return this.uploadFile(file, 'blog', postSlug, 'featured');
  }

  /** Saves a service image and returns the file path. */
  async saveServiceImage(file: File, serviceSlug: string, imageType: string = 'image'): Promise<string> {
    return this.uploadFile(file, 'services', serviceSlug, imageType);
  }

  /** Saves a service icon and returns the file path. */
  async saveServiceIcon(file: File, serviceSlug: string): Promise<string> {
    return this.uploadFile(file, 'services', serviceSlug, 'icon');
  }

  /** Saves a service before/after image and returns the file path. */
  async saveServiceCaseImage(file: File, serviceSlug: string, caseNumber: number, type: 'before' | 'after'): Promise<string> {
    return this.uploadFile(file, 'services', serviceSlug, `case-${caseNumber}-${type}`);
  }

  /** Saves a general media library image (not categorized). */
  async saveGeneralImage(file: File, category: string = 'general'): Promise<string> {
    const baseName = this.slugify(file.name.replace(/\.[^/.]+$/, '')) || 'image';
    return this.uploadFile(file, this.slugify(category) || 'general', 'general', `${baseName}-${Date.now()}`);
  }

  /** Uploads a file to the API media pipeline and returns the canonical path. */
  private async uploadFile(file: File, department: string, entity: string, name: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', department);
    formData.append('entity', entity);
    formData.append('name', name);

    const token = this.adminAuthService.getToken();
    const response = await fetch(this.uploadUrl, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error || `Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.media.path;
  }

  private slugify(value: string): string {
    return (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  /** Generates a sanitized slug from doctor name. */
  generateDoctorSlug(doctorName: string): string {
    return doctorName
      .toLowerCase()
      .replace(/dr\.|dr\s/gi, '')
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  /** Generates a sanitized slug from service name. */
  generateServiceSlug(serviceName: string): string {
    return this.slugify(serviceName);
  }

  /** Generates a sanitized slug from blog post title. */
  generateBlogSlug(title: string): string {
    return this.slugify(title);
  }

  /** Generates a sanitized slug from page name. */
  generatePageSlug(pageName: string): string {
    return this.slugify(pageName);
  }
}
