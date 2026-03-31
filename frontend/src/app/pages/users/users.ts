import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonProgressBar,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { UsersApiService } from '../../services/users-api.service';
import { UserResponseDto } from '../../models/user.model';
import { UserRole } from '../../models/auth.model';
import { getErrorMessage } from '../../shared/utils/error-messages';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  PLANNER: 'Osoba planująca',
  SUPERVISOR: 'Osoba nadzorująca',
  PILOT: 'Pilot',
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrator systemu' },
  { value: 'PLANNER', label: 'Osoba planująca' },
  { value: 'SUPERVISOR', label: 'Osoba nadzorująca' },
  { value: 'PILOT', label: 'Pilot' },
];

@Component({
  selector: 'app-users',
  imports: [
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonModal,
    IonNote,
    IonProgressBar,
    IonRadio,
    IonRadioGroup,
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

  roleModalOpen = signal(false);
  selectedUser = signal<UserResponseDto | null>(null);
  selectedRole = signal<UserRole | null>(null);
  saving = signal(false);

  readonly roleOptions = ROLE_OPTIONS;

  ngOnInit(): void {
    this.loadUsers();
  }

  roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? role;
  }

  openRoleModal(user: UserResponseDto): void {
    this.selectedUser.set(user);
    this.selectedRole.set(user.role);
    this.roleModalOpen.set(true);
  }

  closeRoleModal(): void {
    this.roleModalOpen.set(false);
    this.selectedUser.set(null);
    this.selectedRole.set(null);
  }

  onRoleChange(event: CustomEvent): void {
    this.selectedRole.set(event.detail.value);
  }

  saveRole(): void {
    const user = this.selectedUser();
    const role = this.selectedRole();
    if (!user || !role || role === user.role) {
      this.closeRoleModal();
      return;
    }

    this.saving.set(true);
    this.usersApi.assignRole(user.id, role).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (u.id === updated.id ? updated : u)),
        );
        this.saving.set(false);
        this.closeRoleModal();
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się zmienić roli.'));
        this.saving.set(false);
        this.closeRoleModal();
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
