import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private uploadApiUrl = environment.uploadApiUrl;

  /**
   * Saves a doctor profile image and returns the file path
   * Structure: /assets/img/media-library/doctors/{doctor-slug}/profile.{ext}
   */
  async saveDoctorProfile(file: File, doctorSlug: string): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `profile.${extension}`;
    const uploadPath = `public/assets/img/media-library/doctors/${doctorSlug}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ Profile image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('❌ Profile image upload failed:', error);
      throw error;
    }
  }

  /**
   * Saves a case before/after image and returns the file path
   * Structure: /assets/img/media-library/doctors/{doctor-slug}/cases/case-{N}-{category}/before.{ext}
   */
  async saveCaseImage(file: File, doctorSlug: string, caseNumber: number, type: 'before' | 'after', category: string = ''): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${type}.${extension}`;

    // Create slug from category name
    const categorySlug = category
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim() || 'treatment';

    const folderName = `case-${caseNumber}-${categorySlug}`;
    const uploadPath = `public/assets/img/media-library/doctors/${doctorSlug}/cases/${folderName}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ ${type} image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error(`❌ ${type} image upload failed:`, error);
      throw error;
    }
  }

  /**
   * Saves a page image (hero, background, etc.) and returns the file path
   * Structure: /assets/img/media-library/pages/{page-name}/{filename}
   */
  async savePageImage(file: File, pageName: string, imageType: string): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${imageType}.${extension}`;
    const uploadPath = `public/assets/img/media-library/pages/${pageName}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ Page image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('❌ Page image upload failed:', error);
      throw error;
    }
  }

  /**
   * Saves a blog post image and returns the file path
   * Structure: /assets/img/media-library/blog/{post-slug}/{filename}
   */
  async saveBlogImage(file: File, postSlug: string, imageType: string = 'image'): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const filename = `${imageType}-${timestamp}.${extension}`;
    const uploadPath = `public/assets/img/media-library/blog/${postSlug}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ Blog image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('❌ Blog image upload failed:', error);
      throw error;
    }
  }

  /**
   * Saves a blog featured image and returns the file path
   * Structure: /assets/img/media-library/blog/{post-slug}/featured.{ext}
   */
  async saveBlogFeaturedImage(file: File, postSlug: string): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `featured.${extension}`;
    const uploadPath = `public/assets/img/media-library/blog/${postSlug}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ Blog featured image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('❌ Blog featured image upload failed:', error);
      throw error;
    }
  }

  /**
   * Saves a service image and returns the file path
   * Structure: /assets/img/media-library/services/{service-slug}/{filename}
   */
  async saveServiceImage(file: File, serviceSlug: string, imageType: string = 'image'): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${imageType}.${extension}`;
    const uploadPath = `public/assets/img/media-library/services/${serviceSlug}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ Service image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('❌ Service image upload failed:', error);
      throw error;
    }
  }

  /**
   * Saves a service icon and returns the file path
   * Structure: /assets/img/media-library/services/{service-slug}/icon.{ext}
   */
  async saveServiceIcon(file: File, serviceSlug: string): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filename = `icon.${extension}`;
    const uploadPath = `public/assets/img/media-library/services/${serviceSlug}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ Service icon uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('❌ Service icon upload failed:', error);
      throw error;
    }
  }

  /**
   * Saves a service before/after image and returns the file path
   * Structure: /assets/img/media-library/services/{service-slug}/cases/case-{N}/{before|after}.{ext}
   */
  async saveServiceCaseImage(file: File, serviceSlug: string, caseNumber: number, type: 'before' | 'after'): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${type}.${extension}`;
    const uploadPath = `public/assets/img/media-library/services/${serviceSlug}/cases/case-${caseNumber}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ Service ${type} image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error(`❌ Service ${type} image upload failed:`, error);
      throw error;
    }
  }

  /**
   * Saves a general media library image (not categorized)
   * Structure: /assets/img/media-library/general/{filename}
   */
  async saveGeneralImage(file: File, category: string = 'general'): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '') // Remove extension
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${sanitizedName}-${timestamp}.${extension}`;
    const uploadPath = `public/assets/img/media-library/${category}`;

    try {
      const result = await this.uploadFile(file, uploadPath, filename);
      console.log(`✅ General image uploaded successfully: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('❌ General image upload failed:', error);
      throw error;
    }
  }

  /**
   * Uploads a file to the upload server
   */
  private async uploadFile(file: File, uploadPath: string, filename: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadPath', uploadPath);
    formData.append('filename', filename);

    const response = await fetch(this.uploadApiUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Generates a sanitized slug from doctor name
   */
  generateDoctorSlug(doctorName: string): string {
    return doctorName
      .toLowerCase()
      .replace(/dr\.|dr\s/gi, '')
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  /**
   * Generates a sanitized slug from service name
   */
  generateServiceSlug(serviceName: string): string {
    return serviceName
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  /**
   * Generates a sanitized slug from blog post title
   */
  generateBlogSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  /**
   * Generates a sanitized slug from page name
   */
  generatePageSlug(pageName: string): string {
    return pageName
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }
}
