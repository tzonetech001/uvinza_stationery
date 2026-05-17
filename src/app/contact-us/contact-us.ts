import { Component, inject } from '@angular/core';
import { LanguageThemeService } from '../language-theme.service';

@Component({
  selector: 'app-contact-us',
  imports: [],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs {
  protected readonly languageService = inject(LanguageThemeService);
}
