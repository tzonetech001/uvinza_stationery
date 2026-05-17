import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MikopoService, DaiwaRecord, DaiPayment } from './mikopo.service';

@Component({
  selector: 'app-mikopo-daiwa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daiwa.html',
  styleUrls: ['./daiwa.css'],
})
export class MikopoDaiwaComponent implements OnInit {
  accounts: DaiwaRecord[] = [];
  payments: DaiPayment[] = [];
  selectedAccount: DaiwaRecord = this.createEmptyAccount();
  paymentAccount?: DaiwaRecord;
  paymentAmount = 0;
  paymentDate = new Date().toISOString().slice(0, 10);
  showHistoryAccountId?: number;
  isEditMode = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private mikopoService: MikopoService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  createEmptyAccount(): DaiwaRecord {
    return {
      name: '',
      amount_due: 0,
      due_date: new Date().toISOString().slice(0, 10),
      status: 'Inasubiri'
    };
  }

  loadAccounts(): void {
    this.mikopoService.getDaiwa().subscribe({
      next: value => {
        this.accounts = value.data || [];
        this.payments = value.payments || [];
      },
      error: () => {
        this.errorMessage = 'Imeshindwa kupakua mikopo ya daiwa. Jaribu tena.';
      }
    });
  }

  saveAccount(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedAccount.name) {
      this.errorMessage = 'Tafadhali jaza jina.';
      return;
    }

    this.isLoading = true;
    const request = this.isEditMode
      ? this.mikopoService.updateDaiwa(this.selectedAccount)
      : this.mikopoService.saveDaiwa(this.selectedAccount);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Daiwa imebadilishwa.' : 'Daiwa imehifadhiwa.';
        this.selectedAccount = this.createEmptyAccount();
        this.isEditMode = false;
        this.isLoading = false;
        this.loadAccounts();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kuhifadhi daiwa.';
        this.isLoading = false;
      }
    });
  }

  editAccount(account: DaiwaRecord): void {
    this.selectedAccount = { ...account };
    this.isEditMode = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.selectedAccount = this.createEmptyAccount();
    this.isEditMode = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  deleteAccount(id: number): void {
    if (!confirm('Una hakika unataka kufuta daiwa hii?')) {
      return;
    }

    this.mikopoService.deleteDaiwa(id).subscribe({
      next: () => {
        this.successMessage = 'Daiwa imefutwa.';
        this.loadAccounts();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kufuta daiwa.';
      }
    });
  }

  openPayment(account: DaiwaRecord): void {
    this.paymentAccount = account;
    this.paymentAmount = 0;
    this.paymentDate = new Date().toISOString().slice(0, 10);
    this.errorMessage = '';
    this.successMessage = '';
  }

  savePayment(): void {
    if (!this.paymentAccount) {
      return;
    }

    if (this.paymentAmount <= 0) {
      this.errorMessage = 'Kiasi cha malipo lazima kiwe zaidi ya sifuri.';
      return;
    }

    this.isLoading = true;
    this.mikopoService.recordDaiwaPayment(this.paymentAccount.id!, this.paymentAmount, this.paymentDate).subscribe({
      next: () => {
        this.successMessage = 'Malipo yamehifadhiwa.';
        this.paymentAccount = undefined;
        this.isLoading = false;
        this.loadAccounts();
      },
      error: () => {
        this.errorMessage = 'Hitilafu wakati wa kuhifadhi malipo.';
        this.isLoading = false;
      }
    });
  }

  toggleHistory(accountId: number): void {
    this.showHistoryAccountId = this.showHistoryAccountId === accountId ? undefined : accountId;
  }

  paymentsForAccount(accountId: number): DaiPayment[] {
    return this.payments.filter(payment => payment.daiwa_id === accountId);
  }
}

