import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface MessageAlert {
  type: MessageType;
  message: string;
  title?: string;
}

@Component({
  selector: 'app-message-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.scss']
})
export class MessageAlertComponent implements OnInit, OnChanges {
  @Input() alert: MessageAlert | null = null;
  @Input() showCloseButton = true;
  @Input() autoHide = false;
  @Input() autoHideDelay = 5000; // 5 segundos por defecto

  @Output() closeAlert = new EventEmitter<void>();

  ngOnInit() {
    if (this.autoHide && this.alert) {
      setTimeout(() => {
        this.closeAlert.emit();
      }, this.autoHideDelay);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // El componente detecta automáticamente los cambios en la propiedad alert
  }



  onClose(): void {
    this.closeAlert.emit();
  }

  getAlertClass(): string {
    if (!this.alert) return '';
    
    const baseClass = 'alert alert-dismissible fade show';
    switch (this.alert.type) {
      case 'success':
        return `${baseClass} alert-success`;
      case 'error':
        return `${baseClass} alert-danger`;
      case 'warning':
        return `${baseClass} alert-warning`;
      case 'info':
        return `${baseClass} alert-info`;
      default:
        return `${baseClass} alert-primary`;
    }
  }

  getIconClass(): string {
    if (!this.alert) return '';
    
    switch (this.alert.type) {
      case 'success':
        return 'bi bi-check-circle-fill';
      case 'error':
        return 'bi bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill';
      case 'info':
        return 'bi bi-info-circle-fill';
      default:
        return 'bi bi-info-circle-fill';
    }
  }
}
