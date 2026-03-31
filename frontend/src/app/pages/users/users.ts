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
  selector: 'app-users',
  imports: [IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersPage {}
