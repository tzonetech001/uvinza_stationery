import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MauzoService, MauzoRecord } from './mauzo.service';

@Component({
  selector: 'app-mauzo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mauzo.html',
  styleUrls: ['./mauzo.css'],
})
export class MauzoComponent implements OnInit {
  sales: MauzoRecord[] = [];
  selectedSale: MauzoRecord = this.createEmptySale();
  isEditMode = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private mauzoService: MauzoService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  createEmptySale(): MauzoRecord {
    return {
      item_name: '',
      quantity: 1,
      price: 0,
      total: 0,
      sale_date: new Date().toISOString().slice(0, 10)
    };
  }

  loadSales(): void {
    this.mauzoService.getSales().subscribe({
      next: value => {
        this.sales = value.data || [];
        this.calculateTotals();
      },
      error: () => {
        this.errorMessage = 'Imeshindwa kupakua mauzo. Jaribu tena.';
      }
    });
  }

  saveSale(): void {
    if (!this.selectedSale.item_name) {
      this.errorMessage = 'Tafadhali jaza jina la bidhaa au huduma.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedSale.total = this.selectedSale.quantity * this.selectedSale.price;

    const request = this.isEditMode
      ? this.mauzoService.updateSale(this.selectedSale)
      : this.mauzoService.saveSale(this.selectedSale);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Mauzo yamebadilishwa.' : 'Mauzo yamehifadhiwa.';
        this.selectedSale = this.createEmptySale();
        this.isEditMode = false;
        this.isLoading = false;
        this.loadSales();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kuhifadhi mauzo.';
        this.isLoading = false;
      }
    });
  }

  editSale(sale: MauzoRecord): void {
    this.selectedSale = { ...sale };
    this.isEditMode = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.selectedSale = this.createEmptySale();
    this.isEditMode = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteSale(id: number): void {
    if (!confirm('Una hakika unataka kufuta mauzo haya?')) {
      return;
    }
    this.mauzoService.deleteSale(id).subscribe({
      next: () => {
        this.successMessage = 'Mauzo yamefutwa.';
        this.loadSales();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kufuta mauzo.';
      }
    });
  }

  calculateTotals(): void {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const totals = this.sales.reduce((acc, sale) => {
      const saleDate = new Date(sale.sale_date);
      if (saleDate.toDateString() === today.toDateString()) {
        acc.today += sale.total;
      }
      if (saleDate >= weekStart && saleDate <= today) {
        acc.week += sale.total;
      }
      if (saleDate >= monthStart && saleDate <= today) {
        acc.month += sale.total;
      }
      return acc;
    }, { today: 0, week: 0, month: 0 });

    this.todayTotal = totals.today;
    this.weekTotal = totals.week;
    this.monthTotal = totals.month;
  }

  get todayTotal(): number {
    return this._todayTotal;
  }

  set todayTotal(value: number) {
    this._todayTotal = value;
  }

  get weekTotal(): number {
    return this._weekTotal;
  }

  set weekTotal(value: number) {
    this._weekTotal = value;
  }

  get monthTotal(): number {
    return this._monthTotal;
  }

  set monthTotal(value: number) {
    this._monthTotal = value;
  }

  private _todayTotal = 0;
  private _weekTotal = 0;
  private _monthTotal = 0;
}
