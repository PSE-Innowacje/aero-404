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

import { UsersApiService } from '../../services/users-api.service';
import { UserResponseDto } from '../../models/user.model';
import { getErrorMessage } from '../../shared/utils/error-messages';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  PLANNER: 'Osoba planująca',
  SUPERVISOR: 'Osoba nadzorująca',
  PILOT: 'Pilot',
};

@Component({
  selector: 'app-users',
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
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersPage implements OnInit {
  private usersApi = inject(UsersApiService);

  users = signal<UserResponseDto[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? role;
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
