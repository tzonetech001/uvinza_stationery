import { Component, inject } from '@angular/core';
import { LanguageThemeService } from '../language-theme.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  protected readonly languageService = inject(LanguageThemeService);
}

