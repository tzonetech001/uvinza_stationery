import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageThemeService {
  isEnglish = signal(true);
  isDarkMode = signal(false);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  init(): void {
    if (!this.isBrowser) {
      return;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
    }
    document.body.classList.toggle('dark-theme', this.isDarkMode());

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'sw') {
      this.isEnglish.set(false);
    }
  }

  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
    if (this.isBrowser) {
      document.body.classList.toggle('dark-theme', this.isDarkMode());
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    }
  }

  toggleLanguage(): void {
    this.isEnglish.set(!this.isEnglish());
    if (this.isBrowser) {
      localStorage.setItem('language', this.isEnglish() ? 'en' : 'sw');
    }
  }

  translate(en: string, sw: string): string {
    return this.isEnglish() ? en : sw;
  }
}
