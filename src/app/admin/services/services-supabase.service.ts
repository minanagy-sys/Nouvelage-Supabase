import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminSupabaseService } from './admin-supabase.service';

export interface Service {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description?: string;
  featuredImage?: string;
  gallery: string[];
  duration?: string;
  price?: string;
  priceUnit: string;
  benefits: string[];
  procedureSteps: string[];
  faq: any[];
  category?: string;
  tags: string[];
  featured: boolean;
  orderIndex: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

/**
 * Services Service - SUPABASE ONLY
 * All data loaded from Supabase cloud database
 */
@Injectable({
  providedIn: 'root'
})
export class ServicesSupabaseService {
  constructor(private adminSupabase: AdminSupabaseService) {
    console.log('🔧 ServicesSupabaseService initialized - loading from Supabase');
  }

  getAllServices(): Observable<Service[]> {
    return this.adminSupabase.getAllServices();
  }

  getActiveServices(): Observable<Service[]> {
    return this.adminSupabase.getActiveServices();
  }

  getServicesByCategory(category: string): Observable<Service[]> {
    return this.adminSupabase.getServicesByCategory(category);
  }

  getServiceById(id: string): Observable<Service | null> {
    return this.adminSupabase.getServiceById(id);
  }

  getFeaturedServices(): Observable<Service[]> {
    return this.adminSupabase.getFeaturedServices();
  }

  createService(service: Service): Observable<any> {
    return this.adminSupabase.createService(service);
  }

  updateService(id: string, updates: Partial<Service>): Observable<boolean> {
    return this.adminSupabase.updateService(id, updates);
  }

  deleteService(id: string): Observable<boolean> {
    return this.adminSupabase.deleteService(id);
  }
}
