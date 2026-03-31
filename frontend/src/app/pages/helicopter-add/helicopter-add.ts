import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
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

import { HelicopterApiService } from '../../services/helicopter-api.service';
import { HelicopterStatus } from '../../models/helicopter.model';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { getErrorMessage } from '../../shared/utils/error-messages';

const STATUS_OPTIONS: { value: HelicopterStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Aktywny' },
  { value: 'INACTIVE', label: 'Nieaktywny' },
];

@Component({
  selector: 'app-helicopter-add',
  imports: [
    ReactiveFormsModule,
    FieldErrorsComponent,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
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
  templateUrl: './helicopter-add.html',
  styleUrl: './helicopter-add.scss',
})
export class HelicopterAddPage {
  private fb = inject(FormBuilder);
  private helicopterApi = inject(HelicopterApiService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  readonly statusOptions = STATUS_OPTIONS;

  regNumberErrors: ErrorMessage[] = [
    { key: 'required', message: 'Numer rejestracyjny jest wymagany.' },
    { key: 'maxlength', message: 'Numer rejestracyjny może mieć maksymalnie 30 znaków.' },
  ];

  typeErrors: ErrorMessage[] = [
    { key: 'required', message: 'Typ helikoptera jest wymagany.' },
    { key: 'maxlength', message: 'Typ może mieć maksymalnie 100 znaków.' },
  ];

  descriptionErrors: ErrorMessage[] = [
    { key: 'maxlength', message: 'Opis może mieć maksymalnie 100 znaków.' },
  ];

  maxCrewErrors: ErrorMessage[] = [
    { key: 'required', message: 'Maksymalna załoga jest wymagana.' },
    { key: 'min', message: 'Minimalna wartość to 1.' },
    { key: 'max', message: 'Maksymalna wartość to 10.' },
  ];

  maxPayloadErrors: ErrorMessage[] = [
    { key: 'required', message: 'Maksymalna ładowność jest wymagana.' },
    { key: 'min', message: 'Minimalna wartość to 1 kg.' },
    { key: 'max', message: 'Maksymalna wartość to 1000 kg.' },
  ];

  statusErrors: ErrorMessage[] = [{ key: 'required', message: 'Status jest wymagany.' }];

  rangeKmErrors: ErrorMessage[] = [
    { key: 'required', message: 'Zasięg jest wymagany.' },
    { key: 'min', message: 'Minimalna wartość to 1 km.' },
    { key: 'max', message: 'Maksymalna wartość to 1000 km.' },
  ];

  form: FormGroup = this.fb.group({
    regNumber: ['', [Validators.required, Validators.maxLength(30)]],
    type: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(100)]],
    maxCrew: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
    maxPayload: [null, [Validators.required, Validators.min(1), Validators.max(1000)]],
    status: ['', [Validators.required]],
    reviewDate: [''],
    rangeKm: [null, [Validators.required, Validators.min(1), Validators.max(1000)]],
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
      description: value.description || undefined,
      reviewDate: value.reviewDate || undefined,
    };

    this.helicopterApi.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/helicopters']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się dodać helikoptera.'));
      },
    });
  }
}
