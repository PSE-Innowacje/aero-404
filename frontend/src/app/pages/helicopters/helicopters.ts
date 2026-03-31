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
  selector: 'app-helicopters',
  imports: [IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar],
  templateUrl: './helicopters.html',
  styleUrl: './helicopters.scss',
})
export class HelicoptersPage {}
