import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { IonNote } from '@ionic/angular/standalone';

export interface ErrorMessage {
  key: string;
  message: string;
}

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
    for (const msg of this.messages()) {
      if (errors[msg.key]) return msg.message;
    }
    return 'Nieprawidłowa wartość.';
  }
}
