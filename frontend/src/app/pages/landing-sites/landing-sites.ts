import { Component, inject, signal } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {
  IonButton,
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

import { AirfieldApiService } from '../../services/airfield-api.service';
import { AirfieldResponseDto } from '../../models/airfield.model';
import { getErrorMessage } from '../../shared/utils/error-messages';

@Component({
  selector: 'app-landing-sites',
  imports: [
    RouterLink,
    IonButton,
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
  templateUrl: './landing-sites.html',
  styleUrl: './landing-sites.scss',
})
export class LandingSitesPage implements ViewWillEnter {
  private airfieldApi = inject(AirfieldApiService);

  airfields = signal<AirfieldResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ionViewWillEnter(): void {
    this.loadAirfields();
  }

  private loadAirfields(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.airfieldApi.getAll().subscribe({
      next: (data) => {
        this.airfields.set(data.sort((a, b) => a.name.localeCompare(b.name)));
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać listy lądowisk.'));
        this.loading.set(false);
      },
    });
  }
}
