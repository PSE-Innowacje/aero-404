import { computed, Injectable, signal } from '@angular/core';
import { LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private userData = signal<LoginResponse | null>(null);

  isLoggedIn = computed(() => this.userData() !== null);
  user = this.userData.asReadonly();
  role = computed(() => this.userData()?.role ?? null);
  token = computed(() => this.userData()?.token ?? null);

  setUser(data: LoginResponse) {
    this.userData.set(data);
    localStorage.setItem('userData', JSON.stringify(data));
  }

  clearUser() {
    this.userData.set(null);
    localStorage.removeItem('userData');
  }

  loadFromStorage() {
    const stored = localStorage.getItem('userData');
    if (stored) {
      this.userData.set(JSON.parse(stored));
    }
  }
}
