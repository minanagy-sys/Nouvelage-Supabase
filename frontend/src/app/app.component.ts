import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContentService } from './shared/services/content.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'nouvelage-angular';

  constructor(private content: ContentService) {}

  ngOnInit(): void {
    // Clear all localStorage caches so every page loads fresh from the API
    this.clearAllCaches();

    // Verify the API is reachable (non-blocking)
    this.content.testConnection().then(success => {
      if (success) {
        console.log('✅ Connected to Nouvelage API - all data will load from the database');
      } else {
        console.warn('⚠️ Nouvelage API connection failed - check that the backend is running');
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
    console.log('🧹 Cleared all localStorage caches - loading fresh from the API');
  }
}
