import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageThemeService } from '../language-theme.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  protected readonly languageService = inject(LanguageThemeService);
  email: string = '';
  password: string = '';
  loginError: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loginError = '';

    if (!this.email || !this.password) {
      this.loginError = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    const credentials: LoginCredentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response); // Debug log

        if (response.success) {
          const role = response.user?.role;
          console.log('User role:', role); // Debug log

          if (!role) {
            this.isLoading = false;
            this.loginError = 'Failed to retrieve user role';
            return;
          }

          // Simple navigation without polling
          this.isLoading = false;
          console.log('Navigating to dashboard for role:', role); // Debug log

          switch (role) {
            case 'admin':
              console.log('Navigating to admin dashboard'); // Debug log
              this.router.navigate(['/admin/dashboard']);
              break;
            case 'manager':
              console.log('Navigating to manager dashboard'); // Debug log
              this.router.navigate(['/manager/dashboard']);
              break;
            case 'staff':
              console.log('Navigating to staff dashboard'); // Debug log
              this.router.navigate(['/staff/dashboard']);
              break;
            default:
              console.log('Invalid role:', role); // Debug log
              this.loginError = 'Invalid user role: ' + role;
          }
        } else {
          this.isLoading = false;
          this.loginError = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.loginError = 'An error occurred during login';
        console.error('Login error:', error);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
