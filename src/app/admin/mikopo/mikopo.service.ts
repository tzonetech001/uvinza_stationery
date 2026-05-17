import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DaiRecord {
  id?: number;
  customer_name: string;
  amount_due: number;
  due_date: string;
  status: string;
  total_paid?: number;
}

export interface DaiPayment {
  id?: number;
  dai_id?: number;
  daiwa_id?: number;
  amount_paid: number;
  payment_date: string;
}

export interface DaiwaRecord {
  id?: number;
  name: string;
  amount_due: number;
  due_date: string;
  status: string;
  total_paid?: number;
}

@Injectable({ providedIn: 'root' })
export class MikopoService {
  private apiUrl = 'http://localhost/uvinza_stationery/api';

  constructor(private http: HttpClient) {}

  getDai(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dai.php`);
  }

  saveDai(dai: DaiRecord): Observable<any> {
    return this.http.post(`${this.apiUrl}/dai.php`, { action: 'add', ...dai });
  }

  updateDai(dai: DaiRecord): Observable<any> {
    return this.http.put(`${this.apiUrl}/dai.php`, { action: 'update', ...dai });
  }

  deleteDai(id: number): Observable<any> {
    return this.http.request('DELETE', `${this.apiUrl}/dai.php`, { body: { id } });
  }

  recordDaiPayment(daiId: number, amountPaid: number, paymentDate: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/dai.php`, {
      action: 'payment',
      dai_id: daiId,
      amount_paid: amountPaid,
      payment_date: paymentDate
    });
  }

  getDaiwa(): Observable<any> {
    return this.http.get(`${this.apiUrl}/daiwa.php`);
  }

  saveDaiwa(daiwa: DaiwaRecord): Observable<any> {
    return this.http.post(`${this.apiUrl}/daiwa.php`, { action: 'add', ...daiwa });
  }

  updateDaiwa(daiwa: DaiwaRecord): Observable<any> {
    return this.http.put(`${this.apiUrl}/daiwa.php`, { action: 'update', ...daiwa });
  }

  deleteDaiwa(id: number): Observable<any> {
    return this.http.request('DELETE', `${this.apiUrl}/daiwa.php`, { body: { id } });
  }

  recordDaiwaPayment(daiwaId: number, amountPaid: number, paymentDate: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/daiwa.php`, {
      action: 'payment',
      daiwa_id: daiwaId,
      amount_paid: amountPaid,
      payment_date: paymentDate
    });
  }
}
