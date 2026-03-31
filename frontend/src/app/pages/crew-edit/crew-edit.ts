import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
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
  selector: 'app-crew-edit',
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
    IonModal,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './crew-edit.html',
  styleUrl: './crew-edit.scss',
})
export class CrewEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private crewApi = inject(CrewApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);

  loadingData = signal(true);
  loadError = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  deleteModalOpen = signal(false);
  deleting = signal(false);

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

  private memberId!: number;

  ngOnInit(): void {
    this.memberId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMember();
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
      licenseNumber: value.licenseNumber || undefined,
      licenseExpiry: value.licenseExpiry || undefined,
    };

    this.crewApi.update(this.memberId, payload).subscribe({
      next: async () => {
        this.saving.set(false);
        const toast = await this.toastCtrl.create({
          message: 'Dane zapisane',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/admin/crew']);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(
          getErrorMessage(err, 'Nie udało się zapisać zmian.'),
        );
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
    this.crewApi.delete(this.memberId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.router.navigate(['/admin/crew']);
      },
      error: (err) => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.errorMessage.set(
          getErrorMessage(err, 'Nie udało się usunąć członka załogi.'),
        );
      },
    });
  }

  reload(): void {
    this.loadError.set(false);
    this.errorMessage.set('');
    this.loadingData.set(true);
    this.loadMember();
  }

  private loadMember(): void {
    this.crewApi.getById(this.memberId).subscribe({
      next: (member) => {
        this.form.patchValue({
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          weight: member.weight,
          role: member.role,
          licenseNumber: member.licenseNumber ?? '',
          licenseExpiry: member.licenseExpiry ?? '',
          trainingExpiry: member.trainingExpiry ?? '',
        });
        this.loadingData.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          getErrorMessage(err, 'Nie udało się pobrać danych członka załogi.'),
        );
        this.loadError.set(true);
        this.loadingData.set(false);
      },
    });
  }
}
