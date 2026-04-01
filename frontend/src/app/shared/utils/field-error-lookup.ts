import { ValidationErrors } from '@angular/forms';

export interface ErrorMessage {
  key: string;
  message: string;
}

export function getFirstFieldError(
  errors: ValidationErrors,
  messages: ErrorMessage[],
): string {
  for (const msg of messages) {
    if (errors[msg.key]) return msg.message;
  }
  return 'Nieprawidłowa wartość.';
}
