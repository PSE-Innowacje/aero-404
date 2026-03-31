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
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { AirfieldApiService } from '../../services/airfield-api.service';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { getErrorMessage } from '../../shared/utils/error-messages';

@Component({
  selector: 'app-landing-site-add',
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
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './landing-site-add.html',
  styleUrl: './landing-site-add.scss',
})
export class LandingSiteAddPage {
  private fb = inject(FormBuilder);
  private airfieldApi = inject(AirfieldApiService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  nameErrors: ErrorMessage[] = [
    { key: 'required', message: 'Nazwa jest wymagana.' },
    { key: 'maxlength', message: 'Nazwa może mieć maksymalnie 200 znaków.' },
  ];

  latitudeErrors: ErrorMessage[] = [
    { key: 'required', message: 'Szerokość geograficzna jest wymagana.' },
    { key: 'min', message: 'Minimalna wartość to -90.' },
    { key: 'max', message: 'Maksymalna wartość to 90.' },
  ];

  longitudeErrors: ErrorMessage[] = [
    { key: 'required', message: 'Długość geograficzna jest wymagana.' },
    { key: 'min', message: 'Minimalna wartość to -180.' },
    { key: 'max', message: 'Maksymalna wartość to 180.' },
  ];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.airfieldApi.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/landing-sites']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się dodać lądowiska.'));
      },
    });
  }
}
