import { Component, input, output } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-confirm-delete-modal',
  imports: [IonButton, IonContent, IonFooter, IonHeader, IonModal, IonTitle, IonToolbar],
  template: `
    <ion-modal [isOpen]="isOpen()" (didDismiss)="dismiss.emit()" [cssClass]="'delete-modal'">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Potwierdzenie usunięcia</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding delete-modal-content">
          <p>{{ prefix() }} <strong>{{ entityName() }}</strong>?</p>
        </ion-content>
        <ion-footer>
          <div class="delete-modal-actions">
            <ion-button fill="outline" color="danger" (click)="dismiss.emit()">Nie</ion-button>
            <ion-button color="danger" [disabled]="deleting()" (click)="confirm.emit()">
              @if (deleting()) {
                Usuwanie...
              } @else {
                Tak
              }
            </ion-button>
          </div>
        </ion-footer>
      </ng-template>
    </ion-modal>
  `,
  styles: `
    .delete-modal-content {
      --background: transparent;

      &::part(scroll) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .delete-modal-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding: 16px;
    }
  `,
})
export class ConfirmDeleteModalComponent {
  isOpen = input.required<boolean>();
  deleting = input.required<boolean>();
  prefix = input<string>('Czy na pewno chcesz usunąć');
  entityName = input.required<string>();

  confirm = output<void>();
  dismiss = output<void>();
}
