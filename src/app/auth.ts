import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  MANAGER: 'manager' as const,
  STAFF: 'staff' as const
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface User {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  confirm_password: string;
}

export interface ForgotPasswordData {
  email: string;
  phone: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
  confirm_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  public isLoggedIn = computed(() => this.currentUserSignal() !== null);

  private apiUrl = 'http://localhost/uvinza_stationery/api';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.currentUserSignal.set(JSON.parse(user));
      }
    }
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, credentials).pipe(
      tap((response: any) => {
        if (response.success) {
          this.currentUserSignal.set(response.user);
          if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function') {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
      })
    );
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, data);
  }

  forgotPassword(data: ForgotPasswordData): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot_password.php`, data);
  }

  resetPassword(data: ResetPasswordData): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset_password.php`, data);
  }

  logout() {
    this.currentUserSignal.set(null);
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem('currentUser');
    }
  }

  getPrimaryRole(): string | null {
    const user = this.currentUserSignal();
    return user ? user.role : null;
  }
}

