import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthApiService } from '../../services/auth-api.service';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';

function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  // letters, digits, . - @, exactly one @, after @ at least two letter groups separated by dot
  const regex = /^[a-zA-Z0-9.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z]+(\.[a-zA-Z]+)*$/;
  return regex.test(value) ? null : { emailFormat: true };
}

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FieldErrorsComponent,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonTitle,
    IonToolbar,
    IonText,
    IonSpinner,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

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

  passwordErrors: ErrorMessage[] = [
    { key: 'required', message: 'Hasło jest wymagane.' },
    { key: 'minlength', message: 'Hasło musi mieć minimum 5 znaków.' },
  ];

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100), emailValidator]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authApi.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Wystąpił błąd podczas rejestracji.';
        this.errorMessage.set(msg);
      },
    });
  }
}
