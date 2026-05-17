import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth';
import { AdminLocalizationService } from '../admin-localization.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  editMode = false;
  changePasswordMode = false;
  protected readonly adminLocalization = inject(AdminLocalizationService);
  
  userProfile = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: ''
  };
  
  passwordData = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };
  
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userProfile = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || ''
      };
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.editMode) {
      this.loadUserProfile(); // Reset form if cancel
    }
  }

  togglePasswordMode(): void {
    this.changePasswordMode = !this.changePasswordMode;
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordData = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };
  }

  updateProfile(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    // Simulate API call - replace with actual update
    setTimeout(() => {
      try {
        // Update local user data
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          currentUser.first_name = this.userProfile.first_name;
          currentUser.last_name = this.userProfile.last_name;
          currentUser.email = this.userProfile.email;
          currentUser.phone = this.userProfile.phone;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        this.successMessage = this.adminLocalization.translateKey('profile_updated');
        this.editMode = false;
        this.isLoading = false;
      } catch (error) {
        this.errorMessage = this.adminLocalization.translateKey('profile_update_failed');
        this.isLoading = false;
      }
    }, 500);
  }

  changePassword(): void {
    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      this.errorMessage = this.adminLocalization.translateKey('password_mismatch');
      return;
    }
    
    if (this.passwordData.new_password.length < 6) {
      this.errorMessage = this.adminLocalization.translateKey('password_too_short');
      return;
    }
    
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    // Simulate API call - replace with actual password change
    setTimeout(() => {
      try {
        this.successMessage = this.adminLocalization.translateKey('password_changed');
        this.changePasswordMode = false;
        this.passwordData = {
          current_password: '',
          new_password: '',
          confirm_password: ''
        };
        this.isLoading = false;
      } catch (error) {
        this.errorMessage = this.adminLocalization.translateKey('password_change_failed');
        this.isLoading = false;
      }
    }, 500);
  }

  getFullName(): string {
    return `${this.userProfile.first_name} ${this.userProfile.last_name}`.trim() || 'Not set';
  }

  getAvatarInitials(): string {
    const first = this.userProfile.first_name?.charAt(0) || '';
    const last = this.userProfile.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  }
}