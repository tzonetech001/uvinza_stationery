import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  get adminName(): string {
    const user = this.authService.currentUser();
    if (!user) return 'Admin';
    const firstName = user.first_name || user.name?.split(' ')[0] || '';
    return firstName || 'Msimamizi';
  }

  get todayDate(): string {
    const date = new Date();
    return date.toLocaleDateString('sw-TZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}