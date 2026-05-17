import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MikopoService, DaiRecord, DaiPayment } from './mikopo.service';

@Component({
  selector: 'app-mikopo-dai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dai.html',
  styleUrls: ['./dai.css'],
})
export class MikopoDaiComponent implements OnInit {
  loans: DaiRecord[] = [];
  payments: DaiPayment[] = [];
  selectedLoan: DaiRecord = this.createEmptyLoan();
  paymentLoan?: DaiRecord;
  paymentAmount = 0;
  paymentDate = new Date().toISOString().slice(0, 10);
  showHistoryLoanId?: number;
  isEditMode = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private mikopoService: MikopoService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  createEmptyLoan(): DaiRecord {
    return {
      customer_name: '',
      amount_due: 0,
      due_date: new Date().toISOString().slice(0, 10),
      status: 'Inasubiri'
    };
  }

  loadLoans(): void {
    this.mikopoService.getDai().subscribe({
      next: value => {
        this.loans = value.data || [];
        this.payments = value.payments || [];
      },
      error: () => {
        this.errorMessage = 'Imeshindwa kupakua mikopo. Jaribu tena.';
      }
    });
  }

  saveLoan(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedLoan.customer_name) {
      this.errorMessage = 'Tafadhali jaza jina la mteja.';
      return;
    }

    this.isLoading = true;

    const request = this.isEditMode
      ? this.mikopoService.updateDai(this.selectedLoan)
      : this.mikopoService.saveDai(this.selectedLoan);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Mikopo imebadilishwa.' : 'Mikopo imehifadhiwa.';
        this.selectedLoan = this.createEmptyLoan();
        this.isEditMode = false;
        this.isLoading = false;
        this.loadLoans();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kuhifadhi mikopo.';
        this.isLoading = false;
      }
    });
  }

  editLoan(loan: DaiRecord): void {
    this.selectedLoan = { ...loan };
    this.isEditMode = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.selectedLoan = this.createEmptyLoan();
    this.isEditMode = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteLoan(id: number): void {
    if (!confirm('Una hakika unataka kufuta mikopo hii?')) {
      return;
    }

    this.mikopoService.deleteDai(id).subscribe({
      next: () => {
        this.successMessage = 'Mikopo imefutwa.';
        this.loadLoans();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kufuta mikopo.';
      }
    });
  }

  openPayment(loan: DaiRecord): void {
    this.paymentLoan = loan;
    this.paymentAmount = 0;
    this.paymentDate = new Date().toISOString().slice(0, 10);
    this.errorMessage = '';
    this.successMessage = '';
  }

  savePayment(): void {
    if (!this.paymentLoan) {
      return;
    }

    if (this.paymentAmount <= 0) {
      this.errorMessage = 'Kiasi cha malipo lazima kiwe zaidi ya sifuri.';
      return;
    }

    this.isLoading = true;
    this.mikopoService.recordDaiPayment(this.paymentLoan.id!, this.paymentAmount, this.paymentDate).subscribe({
      next: () => {
        this.successMessage = 'Malipo yamehifadhiwa.';
        this.paymentLoan = undefined;
        this.isLoading = false;
        this.loadLoans();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kuhifadhi malipo.';
        this.isLoading = false;
      }
    });
  }

  toggleHistory(loanId: number): void {
    this.showHistoryLoanId = this.showHistoryLoanId === loanId ? undefined : loanId;
  }

  paymentsForLoan(loanId: number): DaiPayment[] {
    return this.payments.filter(payment => payment.dai_id === loanId);
  }
}

