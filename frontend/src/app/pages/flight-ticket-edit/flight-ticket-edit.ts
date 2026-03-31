import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  IonList,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { forkJoin } from 'rxjs';

import { FlightOrderApiService } from '../../services/flight-order-api.service';
import { PlannedOperationApiService } from '../../services/planned-operation-api.service';
import { HelicopterApiService } from '../../services/helicopter-api.service';
import { CrewApiService } from '../../services/crew-api.service';
import { AirfieldApiService } from '../../services/airfield-api.service';
import {
  FlightOrderResponseDto,
  FlightOrderStatus,
} from '../../models/flight-order.model';
import { HelicopterResponseDto } from '../../models/helicopter.model';
import { CrewMemberResponseDto } from '../../models/crew.model';
import { AirfieldResponseDto } from '../../models/airfield.model';
import { PlannedOperationResponseDto } from '../../models/planned-operation.model';
import { ConfirmDeleteModalComponent } from '../../shared/confirm-delete-modal/confirm-delete-modal';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { getErrorMessage } from '../../shared/utils/error-messages';
import { UserDataService } from '../../services/user-data.service';

const STATUS_LABELS: Record<FlightOrderStatus, string> = {
  INTRODUCED: 'Wprowadzone',
  SUBMITTED: 'Złożone',
  REJECTED: 'Odrzucone',
  ACCEPTED: 'Zaakceptowane',
  PARTIALLY_DONE: 'Częściowo wykonane',
  DONE: 'Wykonane',
  NOT_DONE: 'Niewykonane',
};

const STATUS_COLORS: Record<FlightOrderStatus, string> = {
  INTRODUCED: 'primary',
  SUBMITTED: 'tertiary',
  REJECTED: 'danger',
  ACCEPTED: 'success',
  PARTIALLY_DONE: 'warning',
  DONE: 'success',
  NOT_DONE: 'medium',
};

@Component({
  selector: 'app-flight-ticket-edit',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    ConfirmDeleteModalComponent,
    FieldErrorsComponent,
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
    IonList,
    IonProgressBar,
    RouterLink,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './flight-ticket-edit.html',
  styleUrl: './flight-ticket-edit.scss',
})
export class FlightTicketEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private flightOrderApi = inject(FlightOrderApiService);
  private operationApi = inject(PlannedOperationApiService);
  private helicopterApi = inject(HelicopterApiService);
  private crewApi = inject(CrewApiService);
  private airfieldApi = inject(AirfieldApiService);
  private userDataService = inject(UserDataService);

  order = signal<FlightOrderResponseDto | null>(null);
  helicopters = signal<HelicopterResponseDto[]>([]);
  pilots = signal<CrewMemberResponseDto[]>([]);
  crewMembers = signal<CrewMemberResponseDto[]>([]);
  airfields = signal<AirfieldResponseDto[]>([]);
  operations = signal<PlannedOperationResponseDto[]>([]);

  loadingData = signal(true);
  loadError = signal(false);
  saving = signal(false);
  changingStatus = signal(false);
  errorMessage = signal('');
  deleteModalOpen = signal(false);
  deleting = signal(false);

  canEdit = computed(() => {
    const status = this.order()?.status;
    return status === 'INTRODUCED' || status === 'REJECTED';
  });

  canSubmit = computed(() => {
    return this.order()?.status === 'INTRODUCED';
  });

  canAccept = computed(() => {
    return (
      this.userDataService.role() === 'SUPERVISOR' && this.order()?.status === 'SUBMITTED'
    );
  });

  canReject = computed(() => {
    return (
      this.userDataService.role() === 'SUPERVISOR' && this.order()?.status === 'SUBMITTED'
    );
  });

  canComplete = computed(() => {
    return this.order()?.status === 'ACCEPTED';
  });

  helicopterIdErrors: ErrorMessage[] = [
    { key: 'required', message: 'Helikopter jest wymagany.' },
  ];
  departureAirfieldIdErrors: ErrorMessage[] = [
    { key: 'required', message: 'Lotnisko wylotu jest wymagane.' },
  ];
  arrivalAirfieldIdErrors: ErrorMessage[] = [
    { key: 'required', message: 'Lotnisko przylotu jest wymagane.' },
  ];
  operationIdsErrors: ErrorMessage[] = [
    { key: 'required', message: 'Wybierz co najmniej jedną operację.' },
  ];
  plannedDepartureErrors: ErrorMessage[] = [
    { key: 'required', message: 'Planowany wylot jest wymagany.' },
  ];
  plannedLandingErrors: ErrorMessage[] = [
    { key: 'required', message: 'Planowane lądowanie jest wymagane.' },
    { key: 'dateRange', message: 'Lądowanie nie może być wcześniejsze niż wylot.' },
  ];
  estimatedRouteKmErrors: ErrorMessage[] = [
    { key: 'required', message: 'Szacowana trasa jest wymagana.' },
    { key: 'min', message: 'Trasa musi mieć co najmniej 1 km.' },
  ];

  form: FormGroup = this.fb.group(
    {
      plannedDeparture: ['', [Validators.required]],
      plannedLanding: ['', [Validators.required]],
      pilotId: [null as number | null],
      helicopterId: [null as number | null, [Validators.required]],
      crewMemberIds: [[] as number[]],
      departureAirfieldId: [null as number | null, [Validators.required]],
      arrivalAirfieldId: [null as number | null, [Validators.required]],
      operationIds: [[] as number[], [Validators.required]],
      estimatedRouteKm: [null as number | null, [Validators.required, Validators.min(1)]],
    },
    { validators: [FlightTicketEditPage.dateRangeValidator] },
  );

  private orderId!: number;

  private static dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const from = group.get('plannedDeparture')?.value;
    const to = group.get('plannedLanding')?.value;
    if (from && to && from > to) {
      group.get('plannedLanding')?.setErrors({ dateRange: true });
      return { dateRange: true };
    }
    const toCtrl = group.get('plannedLanding');
    if (toCtrl?.hasError('dateRange')) {
      toCtrl.setErrors(null);
    }
    return null;
  }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  statusLabel(status: FlightOrderStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusColor(status: FlightOrderStatus): string {
    return STATUS_COLORS[status] ?? 'medium';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const v = this.form.getRawValue();
    this.flightOrderApi
      .update(this.orderId, {
        plannedDeparture: v.plannedDeparture,
        plannedLanding: v.plannedLanding,
        pilotId: v.pilotId ?? undefined,
        helicopterId: v.helicopterId!,
        crewMemberIds: v.crewMemberIds.length ? v.crewMemberIds : undefined,
        departureAirfieldId: v.departureAirfieldId!,
        arrivalAirfieldId: v.arrivalAirfieldId!,
        operationIds: v.operationIds,
        estimatedRouteKm: v.estimatedRouteKm!,
      })
      .subscribe({
        next: async () => {
          this.saving.set(false);
          const toast = await this.toastCtrl.create({
            message: 'Zlecenie zapisane',
            duration: 2000,
            color: 'success',
          });
          await toast.present();
          this.router.navigate(['/flight-tickets']);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(getErrorMessage(err, 'Nie udało się zapisać zlecenia.'));
        },
      });
  }

  onStatusSubmit(): void {
    this.changeStatus(
      () => this.flightOrderApi.submit(this.orderId),
      'Zlecenie złożone do akceptacji',
    );
  }

  onAccept(): void {
    this.changeStatus(
      () => this.flightOrderApi.accept(this.orderId),
      'Zlecenie zaakceptowane',
    );
  }

  onReject(): void {
    this.changeStatus(
      () => this.flightOrderApi.reject(this.orderId),
      'Zlecenie odrzucone',
    );
  }

  private readonly completionLabels: Record<string, string> = {
    DONE: 'Zrealizowane w całości',
    PARTIALLY_DONE: 'Zrealizowane w części',
    NOT_DONE: 'Nie zrealizowane',
  };

  async onComplete(): Promise<void> {
    let selectedType: string | undefined;
    const typeAlert = await this.alertCtrl.create({
      header: 'Zakończ zlecenie',
      message: 'Wybierz wynik realizacji zlecenia.',
      inputs: [
        { type: 'radio', label: 'Zrealizowane w całości', value: 'DONE' },
        { type: 'radio', label: 'Zrealizowane w części', value: 'PARTIALLY_DONE' },
        { type: 'radio', label: 'Nie zrealizowane', value: 'NOT_DONE' },
      ],
      buttons: [
        { text: 'Anuluj', role: 'cancel' },
        {
          text: 'Dalej',
          handler: (value: string) => {
            if (!value) return false;
            selectedType = value;
            return true;
          },
        },
      ],
    });
    await typeAlert.present();
    const { role } = await typeAlert.onDidDismiss();
    if (role === 'cancel' || !selectedType) return;
    await this.showResultAlert(selectedType);
  }

  private async showResultAlert(completionType: string): Promise<void> {
    const resultAlert = await this.alertCtrl.create({
      header: this.completionLabels[completionType],
      inputs: [
        { name: 'description', type: 'text', placeholder: 'Dodatkowy opis (opcjonalny)' },
      ],
      buttons: [
        { text: 'Anuluj', role: 'cancel' },
        {
          text: 'Zakończ',
          handler: (data) => {
            const label = this.completionLabels[completionType];
            const desc = data.description?.trim();
            const result = desc ? `${label}. Opis: ${desc}` : `${label}`;
            this.changeStatus(
              () => this.flightOrderApi.complete(this.orderId, { result }),
              'Zlecenie zakończone',
            );
            return true;
          },
        },
      ],
    });
    await resultAlert.present();
  }

  openDeleteModal(): void {
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
  }

  confirmDelete(): void {
    this.deleting.set(true);
    this.flightOrderApi.update(this.orderId, this.form.getRawValue()).subscribe({
      error: () => {
        this.deleting.set(false);
        this.closeDeleteModal();
      },
    });
  }

  reload(): void {
    this.loadError.set(false);
    this.errorMessage.set('');
    this.loadingData.set(true);
    this.loadData();
  }

  private changeStatus(
    action: () => ReturnType<FlightOrderApiService['submit']>,
    successMessage: string,
  ): void {
    this.changingStatus.set(true);
    this.errorMessage.set('');
    action().subscribe({
      next: async () => {
        this.changingStatus.set(false);
        const toast = await this.toastCtrl.create({
          message: successMessage,
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/flight-tickets']);
      },
      error: (err) => {
        this.changingStatus.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się zmienić statusu.'));
      },
    });
  }

  private loadData(): void {
    forkJoin({
      order: this.flightOrderApi.getById(this.orderId),
      helicopters: this.helicopterApi.getAll(),
      crew: this.crewApi.getAll(),
      airfields: this.airfieldApi.getAll(),
      operations: this.operationApi.getAll('CONFIRMED'),
    }).subscribe({
      next: (data) => {
        this.order.set(data.order);
        this.helicopters.set(data.helicopters.filter((h) => h.status === 'ACTIVE'));
        this.pilots.set(data.crew.filter((c) => c.role === 'PILOT'));
        this.crewMembers.set(data.crew);
        this.airfields.set(data.airfields);
        this.operations.set(data.operations);

        const o = data.order;
        this.form.patchValue({
          plannedDeparture: o.plannedDeparture?.slice(0, 16) ?? '',
          plannedLanding: o.plannedLanding?.slice(0, 16) ?? '',
          pilotId: o.pilot?.id ?? null,
          helicopterId: o.helicopter?.id ?? null,
          crewMemberIds: o.crewMembers?.map((c) => c.id) ?? [],
          departureAirfieldId: o.departureAirfield?.id ?? null,
          arrivalAirfieldId: o.arrivalAirfield?.id ?? null,
          operationIds: o.plannedOperations?.map((op) => op.id) ?? [],
          estimatedRouteKm: o.estimatedRouteKm,
        });

        if (!this.canEdit()) {
          this.form.disable();
        }

        this.loadingData.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać danych zlecenia.'));
        this.loadError.set(true);
        this.loadingData.set(false);
      },
    });
  }
}
