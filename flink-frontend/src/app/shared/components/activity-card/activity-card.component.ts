import { Component, Input } from '@angular/core';
import { ActivityCard } from '../../types/ActivityCard';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent {
  constructor(
    private readonly activityService: ActivityService,
    private readonly router: Router
  ) {}
  @Input()
  activity!: ActivityCard;

  joinActivity(id: string) {
    this.activityService.joinActivity(id).subscribe(
      () => {
        this.router.navigate(['/activity', id]);
      },
      (error) => {
        console.error('Error joining activity:', error);
      }
    );
  }
}
