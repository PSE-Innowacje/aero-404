import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
import { UserDataService } from './services/user-data.service';
import {
  libraryOutline,
  clipboardOutline,
  listOutline,
  locationOutline,
  logOutOutline,
  peopleOutline,
  personOutline,
} from 'ionicons/icons';

addIcons({
  'library-outline': libraryOutline,
  'clipboard-outline': clipboardOutline,
  'list-outline': listOutline,
  'location-outline': locationOutline,
  'log-out-outline': logOutOutline,
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
export class App implements OnInit {
  @ViewChild(IonMenu) menu!: IonMenu;
  private userDataService = inject(UserDataService);
  private router = inject(Router);

  ngOnInit() {
    this.userDataService.loadFromStorage();
  }

  async logout() {
    await this.menu.close();
    this.userDataService.clearUser();
    this.router.navigate(['/login']);
  }
}
