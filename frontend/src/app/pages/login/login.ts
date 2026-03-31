import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { UserDataService } from '../../services/user-data.service';
import { ErrorMessage, FieldErrorsComponent } from '../../shared/field-errors/field-errors';
import { emailValidator } from '../../shared/validators/email.validator';
import { getErrorMessage } from '../../shared/utils/error-messages';

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
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);

  ngOnInit() {
    if (this.userDataService.isLoggedIn()) {
      this.router.navigate(['/operations']);
    }
  }

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

    this.authApi.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.userDataService.setUser(res);
        this.router.navigate(['/operations']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(err, 'Nieprawidłowy email lub hasło.'));
      },
    });
  }
}
