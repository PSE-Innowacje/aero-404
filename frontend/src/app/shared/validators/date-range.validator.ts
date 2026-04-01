import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateRangeValidator(
  fromField: string,
  toField: string,
): (group: AbstractControl) => ValidationErrors | null {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get(fromField)?.value;
    const to = group.get(toField)?.value;
    if (from && to && from > to) {
      group.get(toField)?.setErrors({ dateRange: true });
      return { dateRange: true };
    }
    const toCtrl = group.get(toField);
    if (toCtrl?.hasError('dateRange')) {
      const { dateRange, ...rest } = toCtrl.errors!;
      toCtrl.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  };
}
