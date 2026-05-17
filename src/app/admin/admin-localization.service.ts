import { Injectable, inject } from '@angular/core';
import { LanguageThemeService } from '../language-theme.service';

@Injectable({
  providedIn: 'root'
})
export class AdminLocalizationService {
  private readonly languageService = inject(LanguageThemeService);
  private readonly translations = {
    personal_information: {
      en: '📋 Personal Information',
      sw: '📋 Taarifa za Kibinafsi'
    },
    edit_profile: {
      en: '✏️ Edit Profile',
      sw: '✏️ Hariri Profaili'
    },
    first_name: {
      en: 'First Name',
      sw: 'Jina la Kwanza'
    },
    last_name: {
      en: 'Last Name',
      sw: 'Jina la Mwisho'
    },
    email_address: {
      en: 'Email Address',
      sw: 'Anwani ya Barua Pepe'
    },
    phone_number: {
      en: 'Phone Number',
      sw: 'Nambari ya Simu'
    },
    role: {
      en: 'Role',
      sw: 'Nafasi'
    },
    enter_first_name: {
      en: 'Enter first name',
      sw: 'Weka jina la kwanza'
    },
    enter_last_name: {
      en: 'Enter last name',
      sw: 'Weka jina la mwisho'
    },
    enter_email_address: {
      en: 'Enter email address',
      sw: 'Weka anwani ya barua pepe'
    },
    enter_phone_number: {
      en: 'Enter phone number',
      sw: 'Weka nambari ya simu'
    },
    cancel: {
      en: 'Cancel',
      sw: 'Katiza'
    },
    saving: {
      en: 'Saving...',
      sw: 'Inaendelea kuhifadhi...'
    },
    save_changes: {
      en: 'Save Changes',
      sw: 'Hifadhi Mabadiliko'
    },
    security_password: {
      en: '🔒 Security & Password',
      sw: '🔒 Usalama & Nenosiri'
    },
    change_password: {
      en: '🔑 Change Password',
      sw: '🔑 Badili Nenosiri'
    },
    password: {
      en: 'Password',
      sw: 'Nenosiri'
    },
    last_changed: {
      en: 'Last Changed',
      sw: 'Imebadilishwa Mwisho'
    },
    not_available: {
      en: 'Not available',
      sw: 'Haipatikani'
    },
    current_password: {
      en: 'Current Password',
      sw: 'Nenosiri la Sasa'
    },
    enter_current_password: {
      en: 'Enter current password',
      sw: 'Weka nenosiri la sasa'
    },
    new_password: {
      en: 'New Password',
      sw: 'Nenosiri Mpya'
    },
    enter_new_password: {
      en: 'Enter new password',
      sw: 'Weka nenosiri jipya'
    },
    confirm_new_password: {
      en: 'Confirm New Password',
      sw: 'Thibitisha Nenosiri Mpya'
    },
    changing: {
      en: 'Changing...',
      sw: 'Inabadilika...'
    },
    password_mismatch: {
      en: 'New password and confirm password do not match!',
      sw: 'Nenosiri jipya na uthibitishe nenosiri havilingani!'
    },
    password_too_short: {
      en: 'Password must be at least 6 characters long!',
      sw: 'Nenosiri lazima liwe na angalau herufi 6!'
    },
    password_changed: {
      en: 'Password changed successfully!',
      sw: 'Nenosiri limebadilishwa kwa mafanikio!'
    },
    password_change_failed: {
      en: 'Failed to change password. Please try again.',
      sw: 'Imeshindwa kubadili nenosiri. Tafadhali jaribu tena.'
    },
    profile_updated: {
      en: 'Profile updated successfully!',
      sw: 'Profaili imesasishwa kwa mafanikio!'
    },
    profile_update_failed: {
      en: 'Failed to update profile. Please try again.',
      sw: 'Imeshindwa kusasisha profaili. Tafadhali jaribu tena.'
    }
  };

  translateKey(key: keyof typeof AdminLocalizationService.prototype.translations): string {
    const language = this.languageService.isEnglish() ? 'en' : 'sw';
    return this.translations[key]?.[language] ?? key;
  }
}
