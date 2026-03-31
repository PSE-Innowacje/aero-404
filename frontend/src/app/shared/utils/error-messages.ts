import { HttpErrorResponse } from '@angular/common/http';

const ERROR_MAP: Record<number, string> = {
  400: 'Nieprawidłowe dane. Sprawdź formularz.',
  401: 'Nieprawidłowy email lub hasło.',
  403: 'Brak uprawnień do wykonania tej operacji.',
  404: 'Nie znaleziono zasobu.',
  409: 'Konto z tym adresem email już istnieje.',
  500: 'Błąd serwera. Spróbuj ponownie później.',
};

export function getErrorMessage(err: HttpErrorResponse, fallback: string): string {
  if (err.status === 0) {
    return 'Brak połączenia z serwerem. Sprawdź internet.';
  }
  return ERROR_MAP[err.status] ?? fallback;
}
