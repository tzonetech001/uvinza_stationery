import { Component, signal, OnInit, Inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SecurityService } from './security.service';
import { FooterComponent } from './footer/footer';
import { LanguageThemeService } from './language-theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./header.css']
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('uvinza_stationery');
  
  isMobileMenuOpen = signal(false);
  showPublicHeader = signal(true);
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private securityService: SecurityService,
    private router: Router,
    protected readonly languageThemeService: LanguageThemeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Initialize security
      this.securityService.initSecurity();
      
      this.languageThemeService.init();
      
      // Clear console on route change
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.clearConsole();
          this.updateHeaderVisibility(event.urlAfterRedirects);
        }
      });

      this.updateHeaderVisibility(this.router.url);
    }
  }

  private updateHeaderVisibility(url: string): void {
    const currentUrl = url.toLowerCase();
    this.showPublicHeader.set(currentUrl.indexOf('/admin') === -1 && currentUrl.indexOf('/manager') === -1 && currentUrl.indexOf('/staff') === -1);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.protectImages();
    }
  }

  ngOnDestroy(): void {
    // Cleanup
  }

  private clearConsole(): void {
    setTimeout(() => {
      if (console.clear) {
        console.clear();
      }
    }, 100);
  }

  private protectImages(): void {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  toggleTheme(): void {
    this.languageThemeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.languageThemeService.toggleLanguage();
  }
}