import { Component, computed, inject,  signal } from '@angular/core';
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

import { RouterLink } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';
import { UsersApiService } from '../../services/users-api.service';
import { UserResponseDto } from '../../models/user.model';
import { getErrorMessage } from '../../shared/utils/error-messages';
import { roleLabel as roleLabelFn } from '../../shared/utils/role-labels';

@Component({
  selector: 'app-users',
  imports: [
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
    RouterLink,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersPage  {
  private usersApi = inject(UsersApiService);
  private userDataService = inject(UserDataService);

  isAdmin = computed(() => this.userDataService.role() === 'ADMIN');

  users = signal<UserResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ionViewWillEnter(): void {
    this.loadUsers();
  }

  roleLabel(role: string): string {
    return roleLabelFn(role);
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.usersApi.getAll().subscribe({
      next: (data) => {
        this.users.set(data.sort((a, b) => a.email.localeCompare(b.email)));
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać listy użytkowników.'));
        this.loading.set(false);
      },
    });
  }
}
