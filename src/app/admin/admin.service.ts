import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../auth';

export interface ManageUserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  confirm_password?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost/uvinza_stationery/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_all_users.php`);
  }

  addUser(user: ManageUserData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_user.php`, user);
  }

  updateUser(user: ManageUserData): Observable<any> {
    return this.http.post(`${this.apiUrl}/update_user.php`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete_user.php`, { id });
  }
}
