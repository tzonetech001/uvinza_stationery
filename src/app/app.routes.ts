import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { USER_ROLES } from './auth';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./home/home').then(m => m.HomeComponent)
  },
  { 
    path: 'aboutus', 
    loadComponent: () => import('./about-us/about-us').then(m => m.AboutUs)
  },
  { 
    path: 'our-service', 
    loadComponent: () => import('./our-services/our-services').then(m => m.OurServices)
  },
  { 
    path: 'contacts-us', 
    loadComponent: () => import('./contact-us/contact-us').then(m => m.ContactUs)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./login/login').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./register/register').then(m => m.RegisterComponent)
  },
  { 
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-shell').then(m => m.AdminShellComponent),
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    // data: { roles: [USER_ROLES.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'manage-users',
        loadComponent: () => import('./admin/manage-users/manage-users').then(m => m.ManageUsersComponent)
      },
      {
        path: 'mikopo/dai',
        loadComponent: () => import('./admin/mikopo/dai').then(m => m.MikopoDaiComponent)
      },
      {
        path: 'mikopo/daiwa',
        loadComponent: () => import('./admin/mikopo/daiwa').then(m => m.MikopoDaiwaComponent)
      },
      {
        path: 'mauzo',
        loadComponent: () => import('./admin/mauzo/mauzo').then(m => m.MauzoComponent)
      },
      {
        path: 'matumizi',
        loadComponent: () => import('./admin/matumizi/matumizi').then(m => m.MatumiziComponent)
      },
      {
        path: 'message-center',
        loadComponent: () => import('./admin/message-center/message-center').then(m => m.MessageCenterComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./admin/settings/settings').then(m => m.SettingsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./admin/profile/profile').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'manager',
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    // data: { roles: [USER_ROLES.MANAGER, USER_ROLES.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./manager/dashboard/dashboard').then(m => m.ManagerDashboardComponent)
      }
    ]
  },
  {
    path: 'staff',
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    // data: { roles: [USER_ROLES.STAFF, USER_ROLES.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./staff/dashboard/dashboard').then(m => m.StaffDashboardComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/home' }
];