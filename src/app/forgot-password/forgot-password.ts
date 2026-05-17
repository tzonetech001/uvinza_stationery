import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ForgotPasswordData, ResetPasswordData } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageThemeService } from '../language-theme.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  protected readonly languageService = inject(LanguageThemeService);
  step: 'verify' | 'reset' = 'verify';
  email: string = '';
  phone: string = '';
  token: string = '';
  new_password: string = '';
  confirm_password: string = '';
  error: string = '';
  success: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onVerify() {
    this.error = '';
    this.success = '';

    if (!this.email || !this.phone) {
      this.error = 'Please enter both email and phone';
      return;
    }

    this.isLoading = true;
    const data: ForgotPasswordData = { email: this.email, phone: this.phone };

    this.authService.forgotPassword(data).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.success = response.message;
          this.step = 'reset';
        } else {
          this.error = response.message || 'Verification failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'An error occurred during verification';
        console.error('Forgot password error:', error);
      }
    });
  }

  onReset() {
    this.error = '';
    this.success = '';

    if (!this.token || !this.new_password || this.new_password !== this.confirm_password) {
      this.error = 'Please fill all fields and ensure passwords match';
      return;
    }

    this.isLoading = true;
    const data: ResetPasswordData = {
      token: this.token,
      new_password: this.new_password,
      confirm_password: this.confirm_password
    };

    this.authService.resetPassword(data).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.success = response.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.error = response.message || 'Password reset failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'An error occurred during password reset';
        console.error('Reset password error:', error);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}