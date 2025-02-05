import { Component, Input } from '@angular/core';
import { ActivityCard } from '../../types/ActivityCard';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service'; // Import AuthService

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent {
  constructor(
    private readonly activityService: ActivityService,
    readonly router: Router,
    private readonly authService: AuthService // Inject AuthService
  ) {}

  @Input()
  activity: ActivityCard = {
    id: '',
    createdAt: new Date(),
    creator: {
      id: '', // Ensure the creator object has an id field
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

  // Helper method to check if the current user is the creator of the activity
  isCurrentUserCreator(): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    console.log('Current user ID:', currentUserId);
    console.log('Activity creator ID:', this.activity.creator.id);
    return this.activity.creator.id === currentUserId;
  }

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
