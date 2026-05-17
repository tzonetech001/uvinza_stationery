import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer';

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, FooterComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class StaffDashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Auth guard already checks role
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
