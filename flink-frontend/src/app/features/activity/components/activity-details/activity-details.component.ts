import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  activity!: ActivityCard;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private userService: UserService // Inject UserService
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
        },
        (error) => {
          console.error('Error fetching activity details:', error);
        }
      );
    } else {
      console.error('No activity ID found in the URL');
    }
  }
}
