import { Component } from '@angular/core';

@Component({
  selector: 'app-feed-settings',
  templateUrl: './feed-settings.component.html',
  styleUrls: ['./feed-settings.component.scss'],
})
export class FeedSettingsComponent {
  showSortOptions: boolean = false;

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  selectSortOption(option: string) {
    console.log('Selected sorting option:', option);
    this.showSortOptions = false;
  }
}
