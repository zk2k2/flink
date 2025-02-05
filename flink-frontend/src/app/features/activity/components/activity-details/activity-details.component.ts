import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/core/services/activity.service';
import { UserService } from 'src/app/core/services/user.service'; // Assuming you have a UserService to fetch user details
import { ActivityCard } from 'src/app/shared/types/ActivityCard';
import { ActivityMember } from 'src/app/shared/types/ActivityMember';

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
  showInfobox = false;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
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
          console.log(activity);
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
}
