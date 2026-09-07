import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DemoModeService } from './admin/services/demo-mode.service';
import { SupabaseService } from './shared/services/supabase.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'nouvelage-angular';

  constructor(
    private demoModeService: DemoModeService,
    private supabase: SupabaseService
  ) {}

  ngOnInit(): void {
    // Clear all localStorage caches to force Supabase loading
    this.clearAllCaches();

    // Initialize Supabase connection
    this.supabase.initialize(
      environment.supabase.url,
      environment.supabase.anonKey
    );

    // Test Supabase connection
    this.supabase.testConnection().then(success => {
      if (success) {
        console.log('✅ Connected to Supabase database - all data will load from cloud');
      } else {
        console.warn('⚠️ Supabase connection failed - check credentials');
      }
    });
  }

  private clearAllCaches(): void {
    // Clear all localStorage caches on app startup
    localStorage.removeItem('bundles');
    localStorage.removeItem('parentBundles');
    localStorage.removeItem('blogPosts');
    localStorage.removeItem('doctors');
    localStorage.removeItem('mediaLibrary');
    const pages = ['landing', 'forher', 'forhim', 'services', 'contact', 'blog', 'post', 'team', 'bundles-page'];
    pages.forEach(page => localStorage.removeItem(`demo_page_${page}`));
    console.log('🧹 Cleared all localStorage caches - loading fresh from Supabase');
  }
}
