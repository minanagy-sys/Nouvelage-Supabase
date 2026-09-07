import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminContentService } from './admin-content.service';

export interface MediaFile {
  id: string;
  filename: string;
  path: string; // e.g., '/assets/img/blog/', '/assets/img/services/'
  fullPath: string; // complete path with filename
  dataUrl: string; // base64 data
  size: number;
  type: string; // image/jpeg, image/png, etc.
  uploadedAt: string;
  altText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaLibraryService {
  constructor(private adminSupabase: AdminContentService) {}

  getAllMedia(): Observable<MediaFile[]> {
    return this.adminSupabase.getAllMedia();
  }

  getMediaByPath(path: string): Observable<MediaFile[]> {
    return new Observable(observer => {
      this.adminSupabase.getAllMedia().subscribe({
        next: (files) => {
          const filtered = files.filter(f => f.path === path);
          observer.next(filtered);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getMediaById(id: string): Observable<MediaFile | null> {
    return new Observable(observer => {
      this.adminSupabase.getAllMedia().subscribe({
        next: (files) => {
          const file = files.find(f => f.id === id) || null;
          observer.next(file);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  addMedia(file: MediaFile): Observable<any> {
    return this.adminSupabase.uploadMedia(file);
  }

  updateMedia(id: string, updates: Partial<MediaFile>): Observable<boolean> {
    // Update via Supabase
    return new Observable(observer => {
      // AdminContentService doesn't have updateMedia yet, need to add it
      observer.next(true);
      observer.complete();
    });
  }

  deleteMedia(id: string): Observable<boolean> {
    return this.adminSupabase.deleteMedia(id);
  }

  getAvailablePaths(): Observable<string[]> {
    return new Observable(observer => {
      this.getAllMedia().subscribe({
        next: (allMedia) => {
          const paths = allMedia.map((file: any) => file.path);
          observer.next([...new Set(paths)].sort());
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  generateId(): string {
    return 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const cleanName = originalName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    return `${timestamp}-${cleanName}`;
  }
}
