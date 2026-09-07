import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminSupabaseService } from './admin-supabase.service';
import { Doctor } from './doctors.service'; // Keep existing interface

/**
 * Doctors Service - SUPABASE ONLY
 * All data loaded from Supabase cloud database
 */
@Injectable({
  providedIn: 'root'
})
export class DoctorsSupabaseService {
  constructor(private adminSupabase: AdminSupabaseService) {
    console.log('👨‍⚕️ DoctorsSupabaseService initialized - loading from Supabase');
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.adminSupabase.getAllDoctors();
  }

  getDoctorById(id: string): Observable<Doctor | null> {
    return this.adminSupabase.getDoctorById(id);
  }

  getActiveDoctors(): Observable<Doctor[]> {
    return this.adminSupabase.getActiveDoctors();
  }

  getDoctorsByGender(gender: 'male' | 'female'): Observable<Doctor[]> {
    return this.adminSupabase.getDoctorsByGender(gender);
  }

  getDoctorsByBranch(branch: string): Observable<Doctor[]> {
    return this.adminSupabase.getDoctorsByBranch(branch);
  }

  getFeaturedDoctors(): Observable<Doctor[]> {
    return this.adminSupabase.getFeaturedDoctors();
  }

  createDoctor(doctor: Doctor): Observable<any> {
    return this.adminSupabase.createDoctor(doctor);
  }

  updateDoctor(id: string, updates: Partial<Doctor>): Observable<boolean> {
    return this.adminSupabase.updateDoctor(id, updates);
  }

  deleteDoctor(id: string): Observable<boolean> {
    return this.adminSupabase.deleteDoctor(id);
  }
}
