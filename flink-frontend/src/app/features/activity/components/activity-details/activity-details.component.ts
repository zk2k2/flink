import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/core/services/activity.service';
import { ActivityCard } from 'src/app/shared/types/ActivityCard';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss'],
})
export class ActivityDetailsComponent implements OnInit {
  activity: ActivityCard = {
    id: '',
    createdAt: new Date(),
    creator: {
      id: '',
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
  showLeaveActivityModal = false;
  showDeleteActivityModal = false;
  showInfobox = false;
  isCreator = false;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getActivityDetails();
  }

  getActivityDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.activityService.getActivityById(id).subscribe(
        (activity) => {
          this.activity = activity;
          this.isCreator =
            this.activity.creator.id === this.authService.getCurrentUserId();
        },
        (error) => {
          console.error('Error fetching activity details:', error);
        }
      );
    } else {
      console.error('No activity ID found in the URL');
    }
  }

  openLeaveActivityModal(): void {
    this.showLeaveActivityModal = true;
  }

  leaveActivity(): void {
    console.log('Leaving activity:', this.activity);
    if (!this.activity) {
      console.error('No activity found to leave');
      return;
    }

    this.activityService.leaveActivity(this.activity.id).subscribe(
      () => {
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 2000);
        this.showInfobox = true;
      },
      (error) => {
        console.error('Error leaving activity:', error);
      }
    );
  }

  closeLeaveActivityModal(): void {
    this.showLeaveActivityModal = false;
  }

  openDeleteActivityModal(): void {
    this.showDeleteActivityModal = true;
  }

  deleteActivity(): void {
    this.activityService.deleteActivity(this.activity.id).subscribe(
      () => {
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 2000);
        this.showInfobox = true;
      },
      (error) => {
        console.error('Error deleting activity:', error);
      }
    );
  }
}
