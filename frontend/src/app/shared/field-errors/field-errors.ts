import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { IonNote } from '@ionic/angular/standalone';
import { ErrorMessage, getFirstFieldError } from '../utils/field-error-lookup';

export type { ErrorMessage } from '../utils/field-error-lookup';

@Component({
  selector: 'app-field-errors',
  imports: [IonNote],
  template: `
    @if (control()?.touched && control()?.errors; as errors) {
      <ion-note color="danger" class="field-error">
        {{ getFirstError(errors) }}
      </ion-note>
    }
  `,
  styles: `
    .field-error {
      display: block;
      padding: 4px 16px;
      font-size: 0.8rem;
    }
  `,
})
export class FieldErrorsComponent {
  control = input.required<AbstractControl | null>();
  messages = input.required<ErrorMessage[]>();

  getFirstError(errors: ValidationErrors): string {
    return getFirstFieldError(errors, this.messages());
  }
}
