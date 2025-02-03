import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state (invisible)
      transition(':enter, :leave', [
        // Animate both entering and leaving
        animate('200ms ease-in-out', style({ opacity: 1 })), // Fade in/out
      ]),
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(-20px)', opacity: 0 })), // Initial state (slightly above and invisible)
      transition(':enter', [
        animate(
          '200ms ease-in-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ), // Slide down and fade in
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in-out',
          style({ transform: 'translateY(-20px)', opacity: 0 })
        ), // Slide up and fade out
      ]),
    ]),
  ],
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() bodyText: string = '';
  @Input() showCancelButton: boolean = false;
  @Input() showSubmitButton: boolean = false;
  @Input() cancelButtonText: string = 'Cancel';
  @Input() submitButtonText: string = 'Submit';

  @Output() closeModal = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    this.submit.emit();
  }
}
