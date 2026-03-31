import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonNote,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { PlannedOperationApiService } from '../../services/planned-operation-api.service';
import {
  OperationStatus,
  PlannedOperationResponseDto,
} from '../../models/planned-operation.model';
import { getErrorMessage } from '../../shared/utils/error-messages';

const STATUS_LABELS: Record<OperationStatus, string> = {
  INTRODUCED: 'Wprowadzona',
  REJECTED: 'Odrzucona',
  CONFIRMED: 'Potwierdzona',
  SCHEDULED: 'Zaplanowana',
  PARTIALLY_DONE: 'Częściowo wykonana',
  DONE: 'Wykonana',
  RESIGNED: 'Zrezygnowana',
};

const STATUS_COLORS: Record<OperationStatus, string> = {
  INTRODUCED: 'primary',
  REJECTED: 'danger',
  CONFIRMED: 'success',
  SCHEDULED: 'tertiary',
  PARTIALLY_DONE: 'warning',
  DONE: 'success',
  RESIGNED: 'medium',
};

@Component({
  selector: 'app-operations',
  imports: [
    DatePipe,
    RouterLink,
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonGrid,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonNote,
    IonProgressBar,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './operations.html',
  styleUrl: './operations.scss',
})
export class OperationsPage implements ViewWillEnter {
  private operationApi = inject(PlannedOperationApiService);

  operations = signal<PlannedOperationResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ionViewWillEnter(): void {
    this.loadOperations();
  }

  statusLabel(status: OperationStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusColor(status: OperationStatus): string {
    return STATUS_COLORS[status] ?? 'medium';
  }

  private loadOperations(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.operationApi.getAll().subscribe({
      next: (data) => {
        this.operations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać listy operacji.'));
        this.loading.set(false);
      },
    });
  }
}
