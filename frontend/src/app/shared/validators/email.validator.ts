import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9.\-]*@[a-zA-Z0-9\-]+\.[a-zA-Z]+(\.[a-zA-Z]+)*$/;
  return regex.test(value) ? null : { emailFormat: true };
}
