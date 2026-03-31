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

import { FlightOrderApiService } from '../../services/flight-order-api.service';
import {
  FlightOrderResponseDto,
  FlightOrderStatus,
} from '../../models/flight-order.model';
import { getErrorMessage } from '../../shared/utils/error-messages';

const STATUS_LABELS: Record<FlightOrderStatus, string> = {
  INTRODUCED: 'Wprowadzone',
  SUBMITTED: 'Złożone',
  REJECTED: 'Odrzucone',
  ACCEPTED: 'Zaakceptowane',
  PARTIALLY_DONE: 'Częściowo wykonane',
  DONE: 'Wykonane',
  NOT_DONE: 'Niewykonane',
};

const STATUS_COLORS: Record<FlightOrderStatus, string> = {
  INTRODUCED: 'primary',
  SUBMITTED: 'tertiary',
  REJECTED: 'danger',
  ACCEPTED: 'success',
  PARTIALLY_DONE: 'warning',
  DONE: 'success',
  NOT_DONE: 'medium',
};

@Component({
  selector: 'app-flight-tickets',
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
  templateUrl: './flight-tickets.html',
  styleUrl: './flight-tickets.scss',
})
export class FlightTicketsPage implements ViewWillEnter {
  private flightOrderApi = inject(FlightOrderApiService);

  orders = signal<FlightOrderResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ionViewWillEnter(): void {
    this.loadOrders();
  }

  statusLabel(status: FlightOrderStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusColor(status: FlightOrderStatus): string {
    return STATUS_COLORS[status] ?? 'medium';
  }

  private loadOrders(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.flightOrderApi.getAll().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać listy zleceń.'));
        this.loading.set(false);
      },
    });
  }
}
