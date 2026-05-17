import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MatumiziRecord {
  id?: number;
  name: string;
  amount: number;
  expense_date: string;
}

@Injectable({ providedIn: 'root' })
export class MatumiziService {
  private apiUrl = 'http://localhost/uvinza_stationery/api';

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/matumizi.php`);
  }

  saveExpense(expense: MatumiziRecord): Observable<any> {
    return this.http.post(`${this.apiUrl}/matumizi.php`, { action: 'add', ...expense });
  }

  updateExpense(expense: MatumiziRecord): Observable<any> {
    return this.http.put(`${this.apiUrl}/matumizi.php`, { action: 'update', ...expense });
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.request('DELETE', `${this.apiUrl}/matumizi.php`, { body: { id } });
  }
}
