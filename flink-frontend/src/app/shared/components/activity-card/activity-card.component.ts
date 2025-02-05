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
  activity: ActivityCard = {
    id: '',
    createdAt: new Date(),
    creator: {
      firstName: '',
      lastName: '',
      profilePic: '',
    },
    title: '',
    category: {
      icon: '',
      name: '',
    },
    date: '',
    nbOfParticipants: 0,
    description: '',
    activityPhotos: [],
    users: [],
    location: {
      name: '',
      lat: 0,
      lng: 0,
    },
  };

  showInfobox = false;

  joinActivity(id: string) {
    this.activityService.joinActivity(id).subscribe({
      next: () => {
        this.showInfobox = true;

        setTimeout(() => {
          this.router.navigate(['/activity', id]);
        }, 2000);
      },
      error: (error) => {
        console.error('Error joining activity:', error);
        // Optionally show an error message to the user
      },
    });
  }
}
