import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
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
import { forkJoin } from 'rxjs';

import { FlightOrderApiService } from '../../services/flight-order-api.service';
import { PlannedOperationApiService } from '../../services/planned-operation-api.service';
import { HelicopterApiService } from '../../services/helicopter-api.service';
import { CrewApiService } from '../../services/crew-api.service';
import { AirfieldApiService } from '../../services/airfield-api.service';
import { HelicopterResponseDto } from '../../models/helicopter.model';
import { CrewMemberResponseDto } from '../../models/crew.model';
import { AirfieldResponseDto } from '../../models/airfield.model';
import { PlannedOperationResponseDto } from '../../models/planned-operation.model';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { getErrorMessage } from '../../shared/utils/error-messages';

@Component({
  selector: 'app-flight-ticket-add',
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
  templateUrl: './flight-ticket-add.html',
  styleUrl: './flight-ticket-add.scss',
})
export class FlightTicketAddPage implements ViewWillEnter {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private flightOrderApi = inject(FlightOrderApiService);
  private operationApi = inject(PlannedOperationApiService);
  private helicopterApi = inject(HelicopterApiService);
  private crewApi = inject(CrewApiService);
  private airfieldApi = inject(AirfieldApiService);

  helicopters = signal<HelicopterResponseDto[]>([]);
  pilots = signal<CrewMemberResponseDto[]>([]);
  crewMembers = signal<CrewMemberResponseDto[]>([]);
  airfields = signal<AirfieldResponseDto[]>([]);
  operations = signal<PlannedOperationResponseDto[]>([]);

  loading = signal(false);
  loadingData = signal(true);
  errorMessage = signal('');

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
    { validators: [FlightTicketAddPage.dateRangeValidator] },
  );

  private static dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const from = group.get('plannedDeparture')?.value;
    const to = group.get('plannedLanding')?.value;
    if (from && to && from > to) {
      group.get('plannedLanding')?.setErrors({ dateRange: true });
      return { dateRange: true };
    }
    const toCtrl = group.get('plannedLanding');
    if (toCtrl?.hasError('dateRange')) {
      const { dateRange, ...rest } = toCtrl.errors!;
      toCtrl.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  }

  ionViewWillEnter(): void {
    this.loadDropdownData();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const v = this.form.getRawValue();
    this.flightOrderApi
      .create({
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
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/flight-tickets']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(getErrorMessage(err, 'Nie udało się utworzyć zlecenia.'));
        },
      });
  }

  private loadDropdownData(): void {
    this.loadingData.set(true);
    forkJoin({
      helicopters: this.helicopterApi.getAll(),
      crew: this.crewApi.getAll(),
      airfields: this.airfieldApi.getAll(),
      operations: this.operationApi.getAll('CONFIRMED'),
    }).subscribe({
      next: (data) => {
        this.helicopters.set(data.helicopters.filter((h) => h.status === 'ACTIVE'));
        this.pilots.set(data.crew.filter((c) => c.role === 'PILOT'));
        this.crewMembers.set(data.crew);
        this.airfields.set(data.airfields);
        this.operations.set(data.operations);
        this.loadingData.set(false);
      },
      error: (err) => {
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się pobrać danych.'));
        this.loadingData.set(false);
      },
    });
  }
}
