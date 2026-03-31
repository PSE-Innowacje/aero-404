import { Component } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing-sites',
  imports: [IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar],
  templateUrl: './landing-sites.html',
  styleUrl: './landing-sites.scss',
})
export class LandingSitesPage {}
