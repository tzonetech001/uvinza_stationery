import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService implements OnDestroy {
  private isBrowser: boolean;
  private devToolsCheckInterval: any;
  private consoleCheckInterval: any;
  private hasRedirected = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }

  /**
   * Main initialization method - call this from App component
   */
  initSecurity(): void {
    if (!this.isBrowser) return;
    
    setTimeout(() => {
      if (console.clear) console.clear();
    }, 100);
    
    this.preventKeyboardShortcuts();
    this.preventRightClick();
    this.preventTextSelection();
    this.initDevToolsDetection();
    this.initConsoleClearing();
  }

  /**
   * Initialize DevTools detection
   */
  private initDevToolsDetection(): void {
    if (!this.isBrowser) return;

    // Check via timing
    const checkDevTools = () => {
      const startTime = performance.now();
      debugger;
      const endTime = performance.now();
      
      if (endTime - startTime > 100) {
        this.handleDevToolsOpen();
      }
    };

    // Check via window size
    const checkWindowSize = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > 100 || heightDiff > 100) {
        this.handleDevToolsOpen();
      }
    };

    // Run checks periodically
    this.devToolsCheckInterval = setInterval(() => {
      if (!this.hasRedirected) {
        checkDevTools();
        checkWindowSize();
      }
    }, 2000);
  }

  /**
   * Initialize console clearing
   */
  private initConsoleClearing(): void {
    if (!this.isBrowser) return;

    // Clear console periodically
    this.consoleCheckInterval = setInterval(() => {
      if (console.clear && !this.hasRedirected) {
        console.clear();
      }
    }, 1000);
  }

  /**
   * Handle DevTools opening
   */
  private handleDevToolsOpen(): void {
    if (this.hasRedirected) return;
    
    this.hasRedirected = true;
    
    if (console.clear) console.clear();
    
    // Clear sensitive data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    
    // Redirect to login
    setTimeout(() => {
      try {
        this.router.navigate(['/login']);
      } catch (error) {
        window.location.href = '/login';
      }
    }, 100);
  }

  /**
   * Prevent keyboard shortcuts
   */
  private preventKeyboardShortcuts(): void {
    if (!this.isBrowser) return;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // Check for forbidden combinations
      const isForbidden = (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P')) ||
        (e.metaKey && e.altKey && e.key === 'I') ||
        (e.metaKey && e.altKey && e.key === 'J') ||
        (e.metaKey && e.altKey && e.key === 'C') ||
        (e.metaKey && (e.key === 'u' || e.key === 'U'))
      );
      
      if (isForbidden) {
        e.preventDefault();
        e.stopPropagation();
        this.handleDevToolsOpen();
      }
    });
  }

  /**
   * Prevent right-click
   */
  private preventRightClick(): void {
    if (!this.isBrowser) return;

    document.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }

  /**
   * Prevent text selection
   */
  private preventTextSelection(): void {
    if (!this.isBrowser) return;

    // CSS style
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Event listeners
    document.addEventListener('selectstart', (e: Event) => {
      e.preventDefault();
      return false;
    });
    
    document.addEventListener('dragstart', (e: DragEvent) => {
      e.preventDefault();
      return false;
    });
  }

  /**
   * Clear intervals
   */
  private clearIntervals(): void {
    if (this.devToolsCheckInterval) {
      clearInterval(this.devToolsCheckInterval);
    }
    if (this.consoleCheckInterval) {
      clearInterval(this.consoleCheckInterval);
    }
  }
}