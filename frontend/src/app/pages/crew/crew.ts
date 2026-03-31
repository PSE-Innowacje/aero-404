import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonBadge,
  IonButtons,
  IonContent,
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
import { getErrorMessage } from '../../shared/utils/error-messages';

const ROLE_LABELS: Record<string, string> = {
  PILOT: 'Pilot',
  OBSERVER: 'Obserwator',
};

@Component({
  selector: 'app-crew',
  imports: [
    IonBadge,
    IonButtons,
    IonContent,
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
export class CrewPage implements OnInit {
  private crewApi = inject(CrewApiService);

  crew = signal<CrewMemberResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
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
