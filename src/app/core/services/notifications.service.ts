import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private messageService: MessageService) {}

  showSuccess(content: string, summary?: string): void {
    this.messageService.add({
      severity: 'success',
      summary: summary || 'Success',
      detail: content,
    });
  }

  showInfo(content: string, summary?: string): void {
    this.messageService.add({
      severity: 'info',
      summary: summary || 'Info',
      detail: content,
    });
  }

  showWarning(content: string, summary?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: summary || 'Warning',
      detail: content,
    });
  }

  showError(content: string, summary?: string): void {
    this.messageService.add({
      severity: 'error',
      summary: summary || 'Error',
      detail: content,
    });
  }

  showContrast(content: string, summary?: string): void {
    this.messageService.add({
      severity: 'contrast',
      summary: summary || 'Error',
      detail: content,
    });
  }

  showSecondary(content: string, summary?: string): void {
    this.messageService.add({
      severity: 'secondary',
      summary: summary || 'Info',
      detail: content,
    });
  }
}
