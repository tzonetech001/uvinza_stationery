// admin-shell.ts - unchanged but ensure logout works
import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';


@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrls: ['./admin-shell.css'],
})
export class AdminShellComponent implements OnInit {
  sidebarOpen = false;
  activeSection = 'dashboard';
 

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateActiveSection(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveSection(event.urlAfterRedirects);
      }
    });
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  get adminName(): string {
    const user = this.currentUser();
    if (!user) return 'Admin';
    const first = user.first_name || user.name?.split(' ')[0] || '';
    const last = user.last_name || user.name?.split(' ').slice(1).join(' ') || '';
    return `${first} ${last}`.trim() || 'Msimamizi';
  }

  get avatarText(): string {
    const user = this.currentUser();
    const first = user?.first_name || user?.name?.split(' ')[0] || '';
    return first ? first[0].toUpperCase() : 'U';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private updateActiveSection(url: string): void {
    const u = url.toLowerCase();
    if (u.indexOf('mauzo') >= 0) this.activeSection = 'mauzo';
    else if (u.indexOf('matumizi') >= 0) this.activeSection = 'matumizi';
    else if (u.indexOf('mikopo/daiwa') >= 0) this.activeSection = 'mikopo-daiwa';
    else if (u.indexOf('mikopo/dai') >= 0) this.activeSection = 'mikopo-dai';
    else this.activeSection = 'dashboard';
  }
}