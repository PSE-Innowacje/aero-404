import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  airplaneOutline,
  clipboardOutline,
  listOutline,
  locationOutline,
  peopleOutline,
  personOutline,
} from 'ionicons/icons';

addIcons({
  'airplane-outline': airplaneOutline,
  'clipboard-outline': clipboardOutline,
  'list-outline': listOutline,
  'location-outline': locationOutline,
  'people-outline': peopleOutline,
  'person-outline': personOutline,
});

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    IonRouterLink,
    IonApp,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
