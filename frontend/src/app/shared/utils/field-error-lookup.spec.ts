import { getFirstFieldError, ErrorMessage } from './field-error-lookup';

describe('getFirstFieldError', () => {
  const messages: ErrorMessage[] = [
    { key: 'required', message: 'Pole jest wymagane.' },
    { key: 'maxlength', message: 'Za długa wartość.' },
    { key: 'min', message: 'Wartość za mała.' },
  ];

  it('should return message for first matching error key', () => {
    expect(getFirstFieldError({ required: true, maxlength: true }, messages)).toBe(
      'Pole jest wymagane.',
    );
  });

  it('should return second message if first key not in errors', () => {
    expect(getFirstFieldError({ maxlength: { requiredLength: 50 } }, messages)).toBe(
      'Za długa wartość.',
    );
  });

  it('should return default message when no key matches', () => {
    expect(getFirstFieldError({ customError: true }, messages)).toBe('Nieprawidłowa wartość.');
  });

  it('should return default message for empty messages config', () => {
    expect(getFirstFieldError({ required: true }, [])).toBe('Nieprawidłowa wartość.');
  });
});
