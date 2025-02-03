import { Component } from '@angular/core';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onCancel() {
    console.log('Cancel button clicked');
    this.closeModal();
  }

  onSubmit() {
    console.log('Submit button clicked');
    this.closeModal();
  }
  showInfobox = false;
  infoboxMessage = '';

  openInfobox(message: string) {
    this.infoboxMessage = message;
    this.showInfobox = true;

    // Automatically close the infobox after 5 seconds
    setTimeout(() => {
      this.showInfobox = false;
    }, 5000);
  }

  closeInfobox() {
    this.showInfobox = false;
  }
}
