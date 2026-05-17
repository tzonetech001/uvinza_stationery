import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterData, USER_ROLES, UserRole } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageThemeService } from '../language-theme.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  protected readonly languageService = inject(LanguageThemeService);
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  phone: string = '';
  role: UserRole = USER_ROLES.STAFF;
  password: string = '';
  confirm_password: string = '';
  registerError: string = '';
  isLoading: boolean = false;

  get userRoles() {
    return Object.values(USER_ROLES);
  }

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.registerError = '';

    if (!this.first_name || !this.last_name || !this.email || !this.phone || !this.password) {
      this.registerError = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirm_password) {
      this.registerError = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    const data: RegisterData = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      password: this.password,
      confirm_password: this.confirm_password
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          this.registerError = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.registerError = 'An error occurred during registration';
        console.error('Registration error:', error);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
