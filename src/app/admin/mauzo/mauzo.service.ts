import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MauzoRecord {
  id?: number;
  item_name: string;
  quantity: number;
  price: number;
  total: number;
  sale_date: string;
}

@Injectable({ providedIn: 'root' })
export class MauzoService {
  private apiUrl = 'http://localhost/uvinza_stationery/api';

  constructor(private http: HttpClient) {}

  getSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mauzo.php`);
  }

  saveSale(sale: MauzoRecord): Observable<any> {
    return this.http.post(`${this.apiUrl}/mauzo.php`, { action: 'add', ...sale });
  }

  updateSale(sale: MauzoRecord): Observable<any> {
    return this.http.put(`${this.apiUrl}/mauzo.php`, { action: 'update', ...sale });
  }

  deleteSale(id: number): Observable<any> {
    return this.http.request('DELETE', `${this.apiUrl}/mauzo.php`, { body: { id } });
  }
}
