import { FormControl } from '@angular/forms';
import { emailValidator } from './email.validator';

describe('emailValidator', () => {
  function validate(value: string | null) {
    return emailValidator(new FormControl(value));
  }

  it('should return null for empty value', () => {
    expect(validate('')).toBeNull();
    expect(validate(null)).toBeNull();
  });

  it('should accept valid emails', () => {
    expect(validate('admin@aero-404.pl')).toBeNull();
    expect(validate('user@example.com')).toBeNull();
    expect(validate('test.user@domain.co.uk')).toBeNull();
    expect(validate('john123@test-server.org')).toBeNull();
  });

  it('should reject email without @', () => {
    expect(validate('userexample.com')).toEqual({ emailFormat: true });
  });

  it('should reject email without domain', () => {
    expect(validate('user@')).toEqual({ emailFormat: true });
  });

  it('should reject email without TLD', () => {
    expect(validate('user@domain')).toEqual({ emailFormat: true });
  });

  it('should reject email starting with dot', () => {
    expect(validate('.user@example.com')).toEqual({ emailFormat: true });
  });

  it('should reject email with spaces', () => {
    expect(validate('user @example.com')).toEqual({ emailFormat: true });
  });

  it('should reject email without local part', () => {
    expect(validate('@example.com')).toEqual({ emailFormat: true });
  });
});
