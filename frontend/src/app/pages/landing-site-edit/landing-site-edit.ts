import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonModal,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';

import { AirfieldApiService } from '../../services/airfield-api.service';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { MapLandingComponent } from '../../shared/map-landing/map-landing';
import { getErrorMessage } from '../../shared/utils/error-messages';

@Component({
  selector: 'app-landing-site-edit',
  imports: [
    ReactiveFormsModule,
    FieldErrorsComponent,
    MapLandingComponent,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonModal,
    IonProgressBar,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './landing-site-edit.html',
  styleUrl: './landing-site-edit.scss',
})
export class LandingSiteEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private airfieldApi = inject(AirfieldApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);

  loadingData = signal(true);
  loadError = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  deleteModalOpen = signal(false);
  deleting = signal(false);

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

  mapLatitude = toSignal(
    this.form.controls['latitude'].valueChanges.pipe(
      startWith(this.form.controls['latitude'].value),
      map((v) => (v !== null && v !== '' ? +v : undefined)),
    ),
  );

  mapLongitude = toSignal(
    this.form.controls['longitude'].valueChanges.pipe(
      startWith(this.form.controls['longitude'].value),
      map((v) => (v !== null && v !== '' ? +v : undefined)),
    ),
  );

  private airfieldId!: number;

  ngOnInit(): void {
    this.airfieldId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAirfield();
  }

  onMapCoordsChange(coords: { latitude: number; longitude: number }): void {
    this.form.patchValue({ latitude: coords.latitude, longitude: coords.longitude });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.airfieldApi.update(this.airfieldId, this.form.getRawValue()).subscribe({
      next: async () => {
        this.saving.set(false);
        const toast = await this.toastCtrl.create({
          message: 'Dane zapisane',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/admin/landing-sites']);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się zapisać zmian.'));
      },
    });
  }

  openDeleteModal(): void {
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
  }

  confirmDelete(): void {
    this.deleting.set(true);
    this.airfieldApi.delete(this.airfieldId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.router.navigate(['/admin/landing-sites']);
      },
      error: (err) => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się usunąć lądowiska.'));
      },
    });
  }

  reload(): void {
    this.loadError.set(false);
    this.errorMessage.set('');
    this.loadingData.set(true);
    this.loadAirfield();
  }

  private loadAirfield(): void {
    this.airfieldApi.getById(this.airfieldId).subscribe({
      next: (airfield) => {
        this.form.patchValue({
          name: airfield.name,
          latitude: airfield.latitude,
          longitude: airfield.longitude,
        });
        this.loadingData.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać danych lądowiska.'));
        this.loadError.set(true);
        this.loadingData.set(false);
      },
    });
  }
}
