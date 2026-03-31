import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { UsersApiService } from '../../services/users-api.service';
import { UserRole } from '../../models/auth.model';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { emailValidator } from '../../shared/validators/email.validator';
import { getErrorMessage } from '../../shared/utils/error-messages';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrator systemu' },
  { value: 'PLANNER', label: 'Osoba planująca' },
  { value: 'SUPERVISOR', label: 'Osoba nadzorująca' },
  { value: 'PILOT', label: 'Pilot' },
];

@Component({
  selector: 'app-user-add',
  imports: [
    ReactiveFormsModule,
    FieldErrorsComponent,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './user-add.html',
  styleUrl: './user-add.scss',
})
export class UserAddPage {
  private fb = inject(FormBuilder);
  private usersApi = inject(UsersApiService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  readonly roleOptions = ROLE_OPTIONS;

  firstNameErrors: ErrorMessage[] = [
    { key: 'required', message: 'Imię jest wymagane.' },
    { key: 'maxlength', message: 'Imię może mieć maksymalnie 100 znaków.' },
  ];

  lastNameErrors: ErrorMessage[] = [
    { key: 'required', message: 'Nazwisko jest wymagane.' },
    { key: 'maxlength', message: 'Nazwisko może mieć maksymalnie 100 znaków.' },
  ];

  emailErrors: ErrorMessage[] = [
    { key: 'required', message: 'Email jest wymagany.' },
    { key: 'maxlength', message: 'Email może mieć maksymalnie 100 znaków.' },
    { key: 'emailFormat', message: 'Nieprawidłowy format email.' },
  ];

  passwordErrors: ErrorMessage[] = [
    { key: 'required', message: 'Hasło jest wymagane.' },
    { key: 'minlength', message: 'Hasło musi mieć co najmniej 8 znaków.' },
    { key: 'maxlength', message: 'Hasło może mieć maksymalnie 100 znaków.' },
  ];

  roleErrors: ErrorMessage[] = [{ key: 'required', message: 'Rola jest wymagana.' }];

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100), emailValidator]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    role: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const payload = this.form.getRawValue();

    this.usersApi.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się dodać użytkownika.'));
      },
    });
  }
}
