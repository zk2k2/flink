import { Component } from '@angular/core';
import { ActivityService } from 'src/app/core/services/activity.service';
import { ActivityCard } from 'src/app/shared/types/ActivityCard';

@Component({
  selector: 'app-feed-settings',
  templateUrl: './feed-settings.component.html',
  styleUrls: ['./feed-settings.component.scss'],
})
export class FeedSettingsComponent {
  showSortOptions: boolean = false;

  constructor(private activityService: ActivityService) {}

  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  selectSortOption(option: string) {
    console.log('Selected sorting option:', option);
    this.showSortOptions = false;

    this.activityService.getActivities(option, 'feed').subscribe();
  }

  ngOnInit(): void {
    this.selectSortOption('nearest');
  }
}
