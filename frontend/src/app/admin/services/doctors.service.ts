import { Injectable } from '@angular/core';
import { INITIAL_DOCTORS } from './doctors-fallback.data';

export interface BeforeAfter {
  before: string;
  after: string;
  description: string;
  procedure: string;
  category?: string; // face, skin, hair, body, laser
}

export interface Treatment {
  name: string;
  description: string;
}

export interface Doctor {
  id: string;
  slug?: string; // URL-friendly version of name (e.g., "randa-el-aguizy")
  // Personal Info
  name: string;
  title: string; // Dr., Prof., etc.
  specialization: string;
  subSpecialties: string[];

  // Professional Details
  qualifications: string[];
  certificates: string[]; // Educational certificates, degrees, credentials
  experience: number; // years
  languages: string[];
  services: string[]; // Services/treatments doctor performs (multi-select)
  rating: number; // Doctor rating (0-5)

  // Clinic Info
  branches: string[]; // Which branches they work at
  availableDays: string[];
  gender: 'male' | 'female';

  // Media
  profileImage: string;
  beforeAfterGallery: BeforeAfter[];

  // Content
  bio: string; // Short bio/tagline for hero section
  about: string; // Full biography/description about the doctor
  expertise: string[];
  treatments: Treatment[]; // Treatments with name and description

  // Contact/Booking
  bookingLink: string;

  // Display
  featured: boolean;
  order: number;
  active: boolean;

  // Compatibility fields for old doctor detail page
  img?: string; // Same as profileImage
  role?: string; // Same as specialization
  spec?: string; // Same as specialization
  deg?: string; // Degree/title
  exp?: string; // Experience description
  yrs?: string; // Years as string (e.g., "10+")
  tags?: string[]; // Treatment tags for display
  locs?: string | string[]; // Locations as string or array
}

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private doctors: Doctor[] = this.getInitialDoctors();

  constructor() {
    this.loadDoctors();
  }

  // localStorage is absent during server-side rendering; these helpers make
  // every persistence call a safe no-op there.
  private storageGet(key: string): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  }

  private storageSet(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  }

  private storageRemove(key: string): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  }

  private getInitialDoctors(): Doctor[] {
    // Deep-ish copy so runtime edits never mutate the shared fallback data.
    return INITIAL_DOCTORS.map(doctor => ({
      ...doctor,
      beforeAfterGallery: (doctor.beforeAfterGallery || []).map(item => ({ ...item }))
    }));
  }

  private loadDoctors(): void {
    const stored = this.storageGet('doctors_data');
    if (stored) {
      try {
        const loadedDoctors = JSON.parse(stored);

        // Merge loaded data with initial data to preserve certificates and other fields
        const mergedDoctors = this.doctors.map(initialDoctor => {
          const savedDoctor = loadedDoctors.find((d: Doctor) => d.id === initialDoctor.id);
          if (savedDoctor) {
            // Clean up any base64 images from old data
            if (savedDoctor.profileImage && savedDoctor.profileImage.startsWith('data:')) {
              console.warn(`Removing base64 profile image for ${savedDoctor.name}, using initial data`);
              savedDoctor.profileImage = initialDoctor.profileImage;
            }

            if (savedDoctor.beforeAfterGallery) {
              savedDoctor.beforeAfterGallery = savedDoctor.beforeAfterGallery.map((item: any) => {
                const cleanItem = { ...item };
                if (cleanItem.before && cleanItem.before.startsWith('data:')) {
                  console.warn(`Removing base64 before image, resetting to empty`);
                  cleanItem.before = '';
                }
                if (cleanItem.after && cleanItem.after.startsWith('data:')) {
                  console.warn(`Removing base64 after image, resetting to empty`);
                  cleanItem.after = '';
                }
                return cleanItem;
              });
            }

            // Merge: use saved data but keep certificates from initial if saved has none
            return {
              ...initialDoctor,
              ...savedDoctor,
              certificates: savedDoctor.certificates && savedDoctor.certificates.length > 0
                ? savedDoctor.certificates
                : initialDoctor.certificates
            };
          }
          return initialDoctor;
        });

        // Add any NEW doctors from localStorage that aren't in initial data
        const newDoctors = loadedDoctors.filter((loaded: Doctor) =>
          !this.doctors.find(initial => initial.id === loaded.id)
        );

        // Clean base64 from new doctors too
        newDoctors.forEach((doctor: any) => {
          if (doctor.profileImage && doctor.profileImage.startsWith('data:')) {
            doctor.profileImage = '';
          }
          if (doctor.beforeAfterGallery) {
            doctor.beforeAfterGallery = doctor.beforeAfterGallery.map((item: any) => {
              const cleanItem = { ...item };
              if (cleanItem.before && cleanItem.before.startsWith('data:')) cleanItem.before = '';
              if (cleanItem.after && cleanItem.after.startsWith('data:')) cleanItem.after = '';
              return cleanItem;
            });
          }
        });

        this.doctors = [...mergedDoctors, ...newDoctors];
        console.log(`✅ Loaded ${this.doctors.length} doctors (${newDoctors.length} new)`);
      } catch (e) {
        console.error('Error loading doctors:', e);
      }
    }
  }

  private saveDoctors(): void {
    console.log('saveDoctors called, saving', this.doctors.length, 'doctors to localStorage');

    // Since images are now saved as file paths (not base64), we can save everything
    // Filter out any remaining base64 images for safety
    const doctorsToSave = this.doctors.map(doctor => ({
      ...doctor,
      beforeAfterGallery: doctor.beforeAfterGallery.map(item => {
        // Keep items with file paths, convert base64 to empty to save space
        const cleanItem = { ...item };
        if (cleanItem.before && cleanItem.before.startsWith('data:')) {
          console.warn('Removing base64 before image, should use file path');
          cleanItem.before = '';
        }
        if (cleanItem.after && cleanItem.after.startsWith('data:')) {
          console.warn('Removing base64 after image, should use file path');
          cleanItem.after = '';
        }
        return cleanItem;
      })
    }));

    try {
      this.storageSet('doctors_data', JSON.stringify(doctorsToSave));
      console.log('Saved to localStorage successfully');
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      alert('Failed to save changes: Storage quota exceeded. Please contact support.');
    }
  }

  getAllDoctors(): Doctor[] {
    return [...this.doctors];
  }

  getActiveDoctors(): Doctor[] {
    return this.doctors.filter(d => d.active);
  }

  getFeaturedDoctors(): Doctor[] {
    return this.doctors
      .filter(d => d.active && d.featured)
      .sort((a, b) => a.order - b.order);
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }

  getDoctorBySlug(slug: string): Doctor | undefined {
    // First try to find by existing slug
    let doctor = this.doctors.find(d => d.slug === slug);

    // If not found, try to match by generating slug from name
    if (!doctor) {
      doctor = this.doctors.find(d => this.generateSlug(d.name) === slug);

      // Auto-assign the slug if we found a match
      if (doctor && !doctor.slug) {
        doctor.slug = slug;
      }
    }

    return doctor;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/dr\.|dr\s/gi, '')
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  getDoctorsByGender(gender: 'male' | 'female'): Doctor[] {
    return this.doctors.filter(d => d.active && d.gender === gender);
  }

  getDoctorsByBranch(branch: string): Doctor[] {
    return this.doctors.filter(d =>
      d.active && d.branches.includes(branch)
    );
  }

  addDoctor(doctor: Doctor): void {
    this.doctors.push(doctor);
    this.saveDoctors();
  }

  updateDoctor(id: string, doctor: Doctor): void {
    console.log('updateDoctor called:', id, doctor);
    const index = this.doctors.findIndex(d => d.id === id);
    console.log('Found index:', index);
    if (index !== -1) {
      this.doctors[index] = doctor;
      console.log('Doctor updated in array, calling saveDoctors');
      this.saveDoctors();
      console.log('saveDoctors completed');
    } else {
      console.log('Doctor not found with id:', id);
    }
  }

  deleteDoctor(id: string): void {
    this.doctors = this.doctors.filter(d => d.id !== id);
    this.saveDoctors();
  }

  /**
   * Force clean all base64 images from all doctors and re-save
   */
  cleanAllBase64Images(): void {
    let cleanedCount = 0;

    this.doctors = this.doctors.map(doctor => {
      let doctorCleaned = false;

      // Clean profile image
      if (doctor.profileImage && doctor.profileImage.startsWith('data:')) {
        doctor.profileImage = '';
        doctorCleaned = true;
      }

      // Clean before/after gallery
      doctor.beforeAfterGallery = doctor.beforeAfterGallery.map(item => {
        const cleanItem = { ...item };
        if (cleanItem.before && cleanItem.before.startsWith('data:')) {
          cleanItem.before = '';
          doctorCleaned = true;
        }
        if (cleanItem.after && cleanItem.after.startsWith('data:')) {
          cleanItem.after = '';
          doctorCleaned = true;
        }
        return cleanItem;
      });

      if (doctorCleaned) cleanedCount++;
      return doctor;
    });

    this.saveDoctors();
    console.log(`✅ Cleaned base64 images from ${cleanedCount} doctors`);
  }

  generateId(): string {
    return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
