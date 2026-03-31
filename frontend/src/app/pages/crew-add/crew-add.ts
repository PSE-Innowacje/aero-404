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

import { CrewApiService } from '../../services/crew-api.service';
import { CrewRole } from '../../models/crew.model';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { emailValidator } from '../../shared/validators/email.validator';
import { getErrorMessage } from '../../shared/utils/error-messages';

const ROLE_OPTIONS: { value: CrewRole; label: string }[] = [
  { value: 'PILOT', label: 'Pilot' },
  { value: 'OBSERVER', label: 'Obserwator' },
];

@Component({
  selector: 'app-crew-add',
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
  templateUrl: './crew-add.html',
  styleUrl: './crew-add.scss',
})
export class CrewAddPage {
  private fb = inject(FormBuilder);
  private crewApi = inject(CrewApiService);
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

  weightErrors: ErrorMessage[] = [
    { key: 'required', message: 'Waga jest wymagana.' },
    { key: 'min', message: 'Waga musi wynosić co najmniej 30 kg.' },
    { key: 'max', message: 'Waga może wynosić maksymalnie 200 kg.' },
  ];

  roleErrors: ErrorMessage[] = [{ key: 'required', message: 'Rola jest wymagana.' }];

  licenseNumberErrors: ErrorMessage[] = [
    { key: 'maxlength', message: 'Numer licencji może mieć maksymalnie 30 znaków.' },
  ];

  trainingExpiryErrors: ErrorMessage[] = [
    { key: 'required', message: 'Data ważności szkolenia jest wymagana.' },
  ];

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100), emailValidator]],
    weight: [null, [Validators.required, Validators.min(30), Validators.max(200)]],
    role: ['', [Validators.required]],
    licenseNumber: ['', [Validators.maxLength(30)]],
    licenseExpiry: [''],
    trainingExpiry: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    const payload = {
      ...value,
      licenseNumber: value.licenseNumber || undefined,
      licenseExpiry: value.licenseExpiry || undefined,
    };

    this.crewApi.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/crew']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          getErrorMessage(err, 'Nie udało się dodać członka załogi.'),
        );
      },
    });
  }
}
