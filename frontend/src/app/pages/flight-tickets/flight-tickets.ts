import { Component } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-flight-tickets',
  imports: [IonButtons, IonContent, IonGrid, IonHeader, IonMenuButton, IonTitle, IonToolbar],
  templateUrl: './flight-tickets.html',
  styleUrl: './flight-tickets.scss',
})
export class FlightTicketsPage {}
