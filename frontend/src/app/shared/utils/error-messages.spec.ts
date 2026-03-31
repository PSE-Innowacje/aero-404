import { HttpErrorResponse } from '@angular/common/http';
import { getErrorMessage } from './error-messages';

function makeError(status: number): HttpErrorResponse {
  return new HttpErrorResponse({ status });
}

describe('getErrorMessage', () => {
  it('should return network error for status 0', () => {
    expect(getErrorMessage(makeError(0), 'fallback')).toBe(
      'Brak połączenia z serwerem. Sprawdź internet.',
    );
  });

  it('should return mapped message for 400', () => {
    expect(getErrorMessage(makeError(400), 'fallback')).toBe(
      'Nieprawidłowe dane. Sprawdź formularz.',
    );
  });

  it('should return mapped message for 401', () => {
    expect(getErrorMessage(makeError(401), 'fallback')).toBe(
      'Nieprawidłowy email lub hasło.',
    );
  });

  it('should return mapped message for 403', () => {
    expect(getErrorMessage(makeError(403), 'fallback')).toBe(
      'Brak uprawnień do wykonania tej operacji.',
    );
  });

  it('should return mapped message for 404', () => {
    expect(getErrorMessage(makeError(404), 'fallback')).toBe('Nie znaleziono zasobu.');
  });

  it('should return mapped message for 409', () => {
    expect(getErrorMessage(makeError(409), 'fallback')).toBe(
      'Konto z tym adresem email już istnieje.',
    );
  });

  it('should return mapped message for 500', () => {
    expect(getErrorMessage(makeError(500), 'fallback')).toBe(
      'Błąd serwera. Spróbuj ponownie później.',
    );
  });

  it('should return fallback for unmapped status', () => {
    expect(getErrorMessage(makeError(418), 'my fallback')).toBe('my fallback');
    expect(getErrorMessage(makeError(502), 'other')).toBe('other');
  });
});
