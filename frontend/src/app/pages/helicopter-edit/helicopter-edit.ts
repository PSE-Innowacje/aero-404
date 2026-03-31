import { Component, inject, OnInit, signal } from '@angular/core';
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
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
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
  selector: 'app-helicopter-edit',
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
    IonModal,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './helicopter-edit.html',
  styleUrl: './helicopter-edit.scss',
})
export class HelicopterEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private helicopterApi = inject(HelicopterApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);

  loadingData = signal(true);
  loadError = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  deleteModalOpen = signal(false);
  deleting = signal(false);

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

  private helicopterId!: number;

  ngOnInit(): void {
    this.helicopterId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadHelicopter();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    const payload = {
      ...value,
      description: value.description || undefined,
      reviewDate: value.reviewDate || undefined,
    };

    this.helicopterApi.update(this.helicopterId, payload).subscribe({
      next: async () => {
        this.saving.set(false);
        const toast = await this.toastCtrl.create({
          message: 'Dane zapisane',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/admin/helicopters']);
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
    this.helicopterApi.delete(this.helicopterId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.router.navigate(['/admin/helicopters']);
      },
      error: (err) => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się usunąć helikoptera.'));
      },
    });
  }

  reload(): void {
    this.loadError.set(false);
    this.errorMessage.set('');
    this.loadingData.set(true);
    this.loadHelicopter();
  }

  private loadHelicopter(): void {
    this.helicopterApi.getById(this.helicopterId).subscribe({
      next: (helicopter) => {
        this.form.patchValue({
          regNumber: helicopter.regNumber,
          type: helicopter.type,
          description: helicopter.description ?? '',
          maxCrew: helicopter.maxCrew,
          maxPayload: helicopter.maxPayload,
          status: helicopter.status,
          reviewDate: helicopter.reviewDate ?? '',
          rangeKm: helicopter.rangeKm,
        });
        this.loadingData.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać danych helikoptera.'));
        this.loadError.set(true);
        this.loadingData.set(false);
      },
    });
  }
}
