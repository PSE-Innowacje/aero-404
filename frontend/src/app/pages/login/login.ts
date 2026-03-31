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
import { UserService } from '../../services/user.service';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';

function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const regex = /^[a-zA-Z0-9.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z]+(\.[a-zA-Z]+)*$/;
  return regex.test(value) ? null : { emailFormat: true };
}

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  emailErrors: ErrorMessage[] = [
    { key: 'required', message: 'Email jest wymagany.' },
    { key: 'emailFormat', message: 'Nieprawidłowy format email.' },
  ];

  passwordErrors: ErrorMessage[] = [
    { key: 'required', message: 'Hasło jest wymagane.' },
  ];

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.userService.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.loading.set(false);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/operations']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Nieprawidłowy email lub hasło.';
        this.errorMessage.set(msg);
      },
    });
  }
}
