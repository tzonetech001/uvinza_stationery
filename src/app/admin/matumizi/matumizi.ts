import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatumiziService, MatumiziRecord } from './matumizi.service';

@Component({
  selector: 'app-matumizi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matumizi.html',
  styleUrls: ['./matumizi.css'],
})
export class MatumiziComponent implements OnInit {
  expenses: MatumiziRecord[] = [];
  selectedExpense: MatumiziRecord = this.createEmptyExpense();
  isEditMode = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private matumiziService: MatumiziService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  createEmptyExpense(): MatumiziRecord {
    return {
      name: '',
      amount: 0,
      expense_date: new Date().toISOString().slice(0, 10)
    };
  }

  loadExpenses(): void {
    this.matumiziService.getExpenses().subscribe({
      next: value => {
        this.expenses = value.data || [];
      },
      error: () => {
        this.errorMessage = 'Imeshindwa kupakua matumizi. Jaribu tena.';
      }
    });
  }

  saveExpense(): void {
    if (!this.selectedExpense.name) {
      this.errorMessage = 'Tafadhali jaza jina la matumizi.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = this.isEditMode
      ? this.matumiziService.updateExpense(this.selectedExpense)
      : this.matumiziService.saveExpense(this.selectedExpense);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Matumizi yamebadilishwa.' : 'Matumizi yamerekodiwa.';
        this.selectedExpense = this.createEmptyExpense();
        this.isEditMode = false;
        this.isLoading = false;
        this.loadExpenses();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kuhifadhi matumizi.';
        this.isLoading = false;
      }
    });
  }

  editExpense(expense: MatumiziRecord): void {
    this.selectedExpense = { ...expense };
    this.isEditMode = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.selectedExpense = this.createEmptyExpense();
    this.isEditMode = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  deleteExpense(id: number): void {
    if (!confirm('Una hakika unataka kufuta matumizi haya?')) {
      return;
    }

    this.matumiziService.deleteExpense(id).subscribe({
      next: () => {
        this.successMessage = 'Matumizi yamefutwa.';
        this.loadExpenses();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kufuta matumizi.';
      }
    });
  }
}
