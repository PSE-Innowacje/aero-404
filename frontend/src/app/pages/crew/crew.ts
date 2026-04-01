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

import { CrewApiService } from '../../services/crew-api.service';
import { CrewMemberResponseDto } from '../../models/crew.model';
import { UserDataService } from '../../services/user-data.service';
import { getErrorMessage } from '../../shared/utils/error-messages';

const ROLE_LABELS: Record<string, string> = {
  PILOT: 'Pilot',
  OBSERVER: 'Obserwator',
};

@Component({
  selector: 'app-crew',
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
  templateUrl: './crew.html',
  styleUrl: './crew.scss',
})
export class CrewPage implements ViewWillEnter {
  private crewApi = inject(CrewApiService);
  private userDataService = inject(UserDataService);

  isAdmin = computed(() => this.userDataService.role() === 'ADMIN');
  crew = signal<CrewMemberResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ionViewWillEnter(): void {
    this.loadCrew();
  }

  roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? role;
  }

  private loadCrew(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.crewApi.getAll().subscribe({
      next: (data) => {
        this.crew.set(data.sort((a, b) => a.lastName.localeCompare(b.lastName)));
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać listy członków załogi.'));
        this.loading.set(false);
      },
    });
  }
}
