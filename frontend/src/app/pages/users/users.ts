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
  IonModal,
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
    IonButton,
    IonButtons,
    IonContent,
    IonGrid,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonModal,
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

  deleteModalOpen = signal(false);
  userToDelete = signal<UserResponseDto | null>(null);
  deleting = signal(false);

  ionViewWillEnter(): void {
    this.loadUsers();
  }

  roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? role;
  }

  openDeleteModal(user: UserResponseDto): void {
    this.userToDelete.set(user);
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
    this.userToDelete.set(null);
  }

  confirmDelete(): void {
    const user = this.userToDelete();
    if (!user) return;

    this.deleting.set(true);
    this.usersApi.delete(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.deleting.set(false);
        this.closeDeleteModal();
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się usunąć użytkownika.'));
        this.deleting.set(false);
        this.closeDeleteModal();
      },
    });
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
