import { HttpErrorResponse } from '@angular/common/http';
import { getErrorMessage } from './error-messages';

function makeError(status: number, error?: any): HttpErrorResponse {
  return new HttpErrorResponse({ status, error });
}

describe('getErrorMessage', () => {
  it('should return network error for status 0', () => {
    expect(getErrorMessage(makeError(0), 'fallback')).toBe(
      'Brak połączenia z serwerem. Sprawdź internet.',
    );
  });

  describe('backend error body', () => {
    it('should return backend message when present', () => {
      const err = makeError(400, { message: 'Email already exists' });
      expect(getErrorMessage(err, 'fallback')).toBe('Email already exists');
    });

    it('should append backend errors array to message', () => {
      const err = makeError(400, {
        message: 'Validation failed',
        errors: ['email is invalid', 'password too short'],
      });
      expect(getErrorMessage(err, 'fallback')).toBe(
        'Validation failed: email is invalid, password too short',
      );
    });

    it('should ignore empty errors array', () => {
      const err = makeError(400, { message: 'Bad request', errors: [] });
      expect(getErrorMessage(err, 'fallback')).toBe('Bad request');
    });
  });

  describe('status fallback (no backend body)', () => {
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

    it('should return fallback for unmapped status without body', () => {
      expect(getErrorMessage(makeError(418), 'my fallback')).toBe('my fallback');
    });
  });
});
