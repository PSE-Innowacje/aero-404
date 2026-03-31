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
  selector: 'app-operations',
  imports: [IonButtons, IonContent, IonGrid, IonHeader, IonMenuButton, IonTitle, IonToolbar],
  templateUrl: './operations.html',
  styleUrl: './operations.scss',
})
export class OperationsPage {}
