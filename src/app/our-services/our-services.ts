import { Component, inject } from '@angular/core';
import { LanguageThemeService } from '../language-theme.service';

@Component({
  selector: 'app-our-services',
  imports: [],
  templateUrl: './our-services.html',
  styleUrl: './our-services.css',
})
export class OurServices {
  protected readonly languageService = inject(LanguageThemeService);
}
