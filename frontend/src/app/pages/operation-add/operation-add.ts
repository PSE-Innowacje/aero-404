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
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { PlannedOperationApiService } from '../../services/planned-operation-api.service';
import { ActivityType } from '../../models/planned-operation.model';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { getErrorMessage } from '../../shared/utils/error-messages';

const ACTIVITY_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: 'VISUAL_INSPECTION', label: 'Inspekcja wizualna' },
  { value: 'SCAN_3D', label: 'Skan 3D' },
  { value: 'FAULT_LOCATION', label: 'Lokalizacja usterki' },
  { value: 'PHOTOS', label: 'Zdjęcia' },
  { value: 'PATROL', label: 'Patrol' },
];

@Component({
  selector: 'app-operation-add',
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
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
  templateUrl: './operation-add.html',
  styleUrl: './operation-add.scss',
})
export class OperationAddPage {
  private fb = inject(FormBuilder);
  private operationApi = inject(PlannedOperationApiService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');
  kmlFile: File | undefined;

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
    { validators: [OperationAddPage.dateRangeValidator] },
  );

  private static dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const from = group.get('proposedDateFrom')?.value;
    const to = group.get('proposedDateTo')?.value;
    if (from && to && from > to) {
      group.get('proposedDateTo')?.setErrors({ dateRange: true });
      return { dateRange: true };
    }
    const toCtrl = group.get('proposedDateTo');
    if (toCtrl?.hasError('dateRange')) {
      const { dateRange, ...rest } = toCtrl.errors!;
      toCtrl.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
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

    this.loading.set(true);
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

    this.operationApi.create(dto, this.kmlFile).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/operations']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nie udało się dodać operacji.'));
      },
    });
  }
}
