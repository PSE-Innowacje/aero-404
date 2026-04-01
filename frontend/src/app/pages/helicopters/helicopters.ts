import { Component, computed, inject, signal } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { RouterLink } from '@angular/router';
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

import { HelicopterApiService } from '../../services/helicopter-api.service';
import { UserDataService } from '../../services/user-data.service';
import { HelicopterResponseDto, HelicopterStatus } from '../../models/helicopter.model';
import { getErrorMessage } from '../../shared/utils/error-messages';

const STATUS_LABELS: Record<HelicopterStatus, string> = {
  ACTIVE: 'Aktywny',
  INACTIVE: 'Nieaktywny',
};

const STATUS_COLORS: Record<HelicopterStatus, string> = {
  ACTIVE: 'success',
  INACTIVE: 'medium',
};

@Component({
  selector: 'app-helicopters',
  imports: [
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
  templateUrl: './helicopters.html',
  styleUrl: './helicopters.scss',
})
export class HelicoptersPage implements ViewWillEnter {
  private helicopterApi = inject(HelicopterApiService);
  private userDataService = inject(UserDataService);

  isAdmin = computed(() => this.userDataService.role() === 'ADMIN');
  helicopters = signal<HelicopterResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ionViewWillEnter(): void {
    this.loadHelicopters();
  }

  statusLabel(status: HelicopterStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusColor(status: HelicopterStatus): string {
    return STATUS_COLORS[status] ?? 'medium';
  }

  private loadHelicopters(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.helicopterApi.getAll().subscribe({
      next: (data) => {
        this.helicopters.set(data.sort((a, b) => a.regNumber.localeCompare(b.regNumber)));
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać listy helikopterów.'));
        this.loading.set(false);
      },
    });
  }
}
