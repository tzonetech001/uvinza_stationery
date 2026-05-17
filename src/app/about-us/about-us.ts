import { Component, inject } from '@angular/core';
import { LanguageThemeService } from '../language-theme.service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  protected readonly languageService = inject(LanguageThemeService);
}
