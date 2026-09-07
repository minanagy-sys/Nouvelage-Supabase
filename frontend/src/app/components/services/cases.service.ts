import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface Case {
  id: string;
  doctor: string;
  bodypart: string;
  material: string;
  effect: string;
  desc: string;
  before: string;
  after: string;
}

export interface BeforeAfterCase {
  before: string;
  after: string;
  caption: string;
  bodypart?: string;
  material?: string;
  effect?: string;
  desc?: string;
  category?: string; // face, skin, hair, body, laser, machines
}

// Doctor name to ID mapping
const DOCTOR_NAME_TO_ID: { [name: string]: string } = {
  'Dr. Nourhan Ashraf': 'nourhan-ashraf',
  'Dr. Ghada Amer': 'ghada-amer',
  'Dr. Sara Asem': 'sara-asem',
  'Dr. Menna Salman': 'menna-salman',
  'Dr. Poussy Maher': 'poussy-maher',
  'Dr. Dimiana': 'dimiana',
  'Dr. Israa': 'israa',
  'Dr. Asmaa Saad': 'asmaa-saad',
  'Dr. Marian Adel': 'marian-adel',
  'Dr. Dina Saleh': 'dina-saleh',
  'Dr. Hend Farid': 'hend-farid',
  'Dr. Randa El Aguizy': 'randa-el-aguizy',
  'Dr. Reem Al-Kabbash': 'reem-al-kabbash',
  'Dr. Shrouk Yehia': 'shrouk-yehia',
  'Dr. Toka Tharwat': 'toka-tharwat'
};

// Map bodypart to category
function getCategoryFromBodypart(bodypart: string, material: string): string {
  if (!bodypart) return 'skin';
  const bp = bodypart.toLowerCase();
  const mat = (material || '').toLowerCase();

  // Check for laser-related keywords
  if (mat.includes('laser') || bp.includes('laser')) return 'laser';

  // Check for machine-based treatments
  if (mat.includes('machine') || mat.includes('ultherapy') || mat.includes('morpheus')) return 'machines';

  // Check for hair
  if (bp.includes('hair') || bp.includes('scalp')) return 'hair';

  // Check for body
  if (bp.includes('body') || bp.includes('arm') || bp.includes('leg') || bp.includes('abdomen')) return 'body';

  // Check for face
  if (bp.includes('face') || bp.includes('cheek') || bp.includes('lip') || bp.includes('chin') ||
      bp.includes('nose') || bp.includes('forehead') || bp.includes('eye')) return 'face';

  // Default to skin
  return 'skin';
}

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  private casesCache$: Observable<Case[]> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Load all cases from the JSON file
   */
  private loadCases(): Observable<Case[]> {
    // The cases JSON is a static browser asset with a relative URL, which
    // cannot be fetched during server rendering — the gallery hydrates in
    // the browser instead (it sits below the fold anyway).
    if (typeof window === 'undefined') {
      return of([]);
    }
    if (!this.casesCache$) {
      this.casesCache$ = this.http.get<Case[]>('assets/cases-data.json').pipe(
        shareReplay(1) // Cache the result
      );
    }
    return this.casesCache$;
  }

  /**
   * Get cases for a specific doctor ID
   */
  getCasesForDoctor(doctorId: string): Observable<BeforeAfterCase[]> {
    return this.loadCases().pipe(
      map(cases => {
        console.log('CasesService.getCasesForDoctor: Total cases loaded:', cases.length);
        console.log('CasesService.getCasesForDoctor: Looking for doctor ID:', doctorId);

        // Find doctor name from ID
        const doctorName = Object.entries(DOCTOR_NAME_TO_ID)
          .find(([name, id]) => id === doctorId)?.[0];

        console.log('CasesService.getCasesForDoctor: Doctor ID:', doctorId, '-> Name:', doctorName);

        if (!doctorName) {
          console.warn('CasesService.getCasesForDoctor: Doctor name not found for ID:', doctorId);
          return [];
        }

        // Filter cases by doctor and convert to BeforeAfterCase format
        const doctorCases = cases.filter(c => c.doctor === doctorName);
        console.log('CasesService.getCasesForDoctor: Found', doctorCases.length, 'cases for', doctorName);

        const result = doctorCases.map(c => ({
          before: c.before,
          after: c.after,
          caption: c.desc || c.effect || 'Treatment result',
          bodypart: c.bodypart,
          material: c.material,
          effect: c.effect,
          desc: c.desc,
          category: getCategoryFromBodypart(c.bodypart, c.material)
        }));

        console.log('CasesService.getCasesForDoctor: Returning', result.length, 'formatted cases');
        return result;
      })
    );
  }

  /**
   * Get cases for doctors performing a specific service
   */
  getCasesForService(doctorIds: string[]): Observable<BeforeAfterCase[]> {
    return this.loadCases().pipe(
      map(cases => {
        console.log('CasesService.getCasesForService: Total cases loaded:', cases.length);
        console.log('CasesService.getCasesForService: Doctor IDs:', doctorIds);

        // Find doctor names from IDs
        const doctorNames = doctorIds
          .map(id => Object.entries(DOCTOR_NAME_TO_ID)
            .find(([name, docId]) => docId === id)?.[0])
          .filter(name => name !== undefined) as string[];

        console.log('CasesService.getCasesForService: Doctor names:', doctorNames);

        if (doctorNames.length === 0) {
          console.warn('CasesService.getCasesForService: No doctor names found for IDs:', doctorIds);
          return [];
        }

        // Filter cases by doctors and convert to BeforeAfterCase format
        const serviceCases = cases.filter(c => doctorNames.includes(c.doctor));
        console.log('CasesService.getCasesForService: Found', serviceCases.length, 'cases for service');

        const result = serviceCases.map(c => ({
          before: c.before,
          after: c.after,
          caption: c.desc || c.effect || 'Treatment result',
          bodypart: c.bodypart,
          material: c.material,
          effect: c.effect,
          desc: c.desc,
          category: getCategoryFromBodypart(c.bodypart, c.material)
        }));

        console.log('CasesService.getCasesForService: Returning', result.length, 'formatted cases');
        return result;
      })
    );
  }
}
