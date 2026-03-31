import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';

import { ConfirmDeleteModalComponent } from '../../shared/confirm-delete-modal/confirm-delete-modal';
import { MapRouteComponent } from '../../shared/map-route/map-route';
import { PlannedOperationApiService } from '../../services/planned-operation-api.service';
import {
  ActivityType,
  OperationStatus,
  PlannedOperationResponseDto,
} from '../../models/planned-operation.model';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { getErrorMessage } from '../../shared/utils/error-messages';
import { UserDataService } from '../../services/user-data.service';

const ACTIVITY_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: 'VISUAL_INSPECTION', label: 'Inspekcja wizualna' },
  { value: 'SCAN_3D', label: 'Skan 3D' },
  { value: 'FAULT_LOCATION', label: 'Lokalizacja usterki' },
  { value: 'PHOTOS', label: 'Zdjęcia' },
  { value: 'PATROL', label: 'Patrol' },
];

const STATUS_LABELS: Record<OperationStatus, string> = {
  INTRODUCED: 'Wprowadzona',
  REJECTED: 'Odrzucona',
  CONFIRMED: 'Potwierdzona',
  SCHEDULED: 'Zaplanowana',
  PARTIALLY_DONE: 'Częściowo wykonana',
  DONE: 'Wykonana',
  RESIGNED: 'Zrezygnowana',
};

const STATUS_COLORS: Record<OperationStatus, string> = {
  INTRODUCED: 'primary',
  REJECTED: 'danger',
  CONFIRMED: 'success',
  SCHEDULED: 'tertiary',
  PARTIALLY_DONE: 'warning',
  DONE: 'success',
  RESIGNED: 'medium',
};

@Component({
  selector: 'app-operation-edit',
  imports: [
    ReactiveFormsModule,
    ConfirmDeleteModalComponent,
    FieldErrorsComponent,
    MapRouteComponent,
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './operation-edit.html',
  styleUrl: './operation-edit.scss',
})
export class OperationEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private operationApi = inject(PlannedOperationApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private userDataService = inject(UserDataService);

  loadingData = signal(true);
  loadError = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  deleteModalOpen = signal(false);
  deleting = signal(false);

  operation = signal<PlannedOperationResponseDto | null>(null);
  routePoints = signal<[number, number][]>([]);
  changingStatus = signal(false);

  canReject = computed(() => {
    return this.userDataService.role() === 'SUPERVISOR' && this.operation()?.status === 'INTRODUCED';
  });

  canConfirm = computed(() => {
    return this.userDataService.role() === 'SUPERVISOR' && this.operation()?.status === 'INTRODUCED';
  });

  canResign = computed(() => {
    const status = this.operation()?.status;
    return (
      this.userDataService.role() === 'PLANNER' &&
      (status === 'INTRODUCED' || status === 'CONFIRMED' || status === 'SCHEDULED')
    );
  });

  readonly activityOptions = ACTIVITY_OPTIONS;

  shortDescriptionErrors: ErrorMessage[] = [
    { key: 'required', message: 'Krótki opis jest wymagany.' },
    { key: 'maxlength', message: 'Opis może mieć maksymalnie 255 znaków.' },
  ];

  activityTypesErrors: ErrorMessage[] = [
    { key: 'required', message: 'Wybierz co najmniej jeden typ aktywności.' },
  ];

  orderNumberErrors: ErrorMessage[] = [
    { key: 'maxlength', message: 'Numer zlecenia może mieć maksymalnie 50 znaków.' },
  ];

  proposedDateToErrors: ErrorMessage[] = [
    { key: 'dateRange', message: 'Data do nie może być wcześniejsza niż data od.' },
  ];

  form: FormGroup = this.fb.group(
    {
      orderNumber: ['', [Validators.maxLength(50)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(255)]],
      proposedDateFrom: [''],
      proposedDateTo: [''],
      activityTypes: [[] as ActivityType[], [Validators.required]],
      additionalInfo: [''],
      contactEmails: [''],
    },
    { validators: [OperationEditPage.dateRangeValidator] },
  );

  private operationId!: number;
  kmlFile: File | undefined;

  private static dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const from = group.get('proposedDateFrom')?.value;
    const to = group.get('proposedDateTo')?.value;
    if (from && to && from > to) {
      group.get('proposedDateTo')?.setErrors({ dateRange: true });
      return { dateRange: true };
    }
    const toCtrl = group.get('proposedDateTo');
    if (toCtrl?.hasError('dateRange')) {
      toCtrl.setErrors(null);
    }
    return null;
  }

  ngOnInit(): void {
    this.operationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOperation();
  }

  statusLabel(status: OperationStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusColor(status: OperationStatus): string {
    return STATUS_COLORS[status] ?? 'medium';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.kmlFile = input.files?.[0];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    const dto = {
      ...value,
      orderNumber: value.orderNumber || undefined,
      proposedDateFrom: value.proposedDateFrom || undefined,
      proposedDateTo: value.proposedDateTo || undefined,
      additionalInfo: value.additionalInfo || undefined,
      contactEmails: value.contactEmails || undefined,
    };

    this.operationApi.update(this.operationId, dto, this.kmlFile).subscribe({
      next: async () => {
        this.saving.set(false);
        const toast = await this.toastCtrl.create({
          message: 'Dane zapisane',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/operations']);
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
    this.operationApi.delete(this.operationId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.router.navigate(['/operations']);
      },
      error: (err) => {
        this.deleting.set(false);
        this.closeDeleteModal();
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się usunąć operacji.'));
      },
    });
  }

  onReject(): void {
    this.changingStatus.set(true);
    this.errorMessage.set('');
    this.operationApi.reject(this.operationId).subscribe({
      next: async () => {
        this.changingStatus.set(false);
        const toast = await this.toastCtrl.create({
          message: 'Operacja odrzucona',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/operations']);
      },
      error: (err) => {
        this.changingStatus.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się odrzucić operacji.'));
      },
    });
  }

  async onConfirm(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Potwierdź do planu',
      message: 'Podaj planowane daty realizacji operacji.',
      inputs: [
        { name: 'plannedDateFrom', type: 'date', label: 'Data od' },
        { name: 'plannedDateTo', type: 'date', label: 'Data do' },
      ],
      buttons: [
        { text: 'Anuluj', role: 'cancel' },
        {
          text: 'Potwierdź',
          handler: (data) => {
            if (!data.plannedDateFrom || !data.plannedDateTo) {
              return false;
            }
            this.changingStatus.set(true);
            this.errorMessage.set('');
            this.operationApi
              .confirm(this.operationId, data.plannedDateFrom, data.plannedDateTo)
              .subscribe({
                next: async () => {
                  this.changingStatus.set(false);
                  const toast = await this.toastCtrl.create({
                    message: 'Operacja potwierdzona do planu',
                    duration: 2000,
                    color: 'success',
                  });
                  await toast.present();
                  this.router.navigate(['/operations']);
                },
                error: (err) => {
                  this.changingStatus.set(false);
                  this.errorMessage.set(
                    getErrorMessage(err, 'Nie udało się potwierdzić operacji.'),
                  );
                },
              });
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  onResign(): void {
    this.changingStatus.set(true);
    this.errorMessage.set('');
    this.operationApi.resign(this.operationId).subscribe({
      next: async () => {
        this.changingStatus.set(false);
        const toast = await this.toastCtrl.create({
          message: 'Zrezygnowano z operacji',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/operations']);
      },
      error: (err) => {
        this.changingStatus.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się zrezygnować z operacji.'));
      },
    });
  }

  reload(): void {
    this.loadError.set(false);
    this.errorMessage.set('');
    this.loadingData.set(true);
    this.loadOperation();
  }

  private loadOperation(): void {
    this.operationApi.getById(this.operationId).subscribe({
      next: (op) => {
        this.operation.set(op);
        console.log(op.routePoints)
        try {
          this.routePoints.set(op.routePoints ? JSON.parse(op.routePoints) : []);
        } catch {
          this.routePoints.set([]);
        }
        this.form.patchValue({
          orderNumber: op.orderNumber ?? '',
          shortDescription: op.shortDescription,
          proposedDateFrom: op.proposedDateFrom ?? '',
          proposedDateTo: op.proposedDateTo ?? '',
          activityTypes: op.activityTypes,
          additionalInfo: op.additionalInfo ?? '',
          contactEmails: op.contactEmails ?? '',
        });
        this.loadingData.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać danych operacji.'));
        this.loadError.set(true);
        this.loadingData.set(false);
      },
    });
  }
}
