import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilesServiceService } from './profiles-service.service';
import { ActivityService } from 'src/app/core/services/activity.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivityCard } from 'src/app/shared/types/ActivityCard';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isCurrentUser: boolean = false;
  activities: ActivityCard[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfilesServiceService,
    private authService: AuthService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userid');
      if (userId) {
        this.loadUserProfile(userId);
        this.loadUserActivities(userId);
        this.checkIfCurrentUser(userId);
      }
    });
  }

  private loadUserProfile(userId: string): void {
    this.profileService.getUserProfile(userId).subscribe({
      next: (userData) => {
        this.user = userData;
        console.log('User data:', this.user);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadUserActivities(userId: string): void {
    this.activityService.getProfileActivities(userId).subscribe({
      next: (activities) => {
        this.activities = activities;
        console.log('User activities:', this.activities);
      },
      error: (error) => {
        console.error('Error loading activities:', error);
      }
    });
  }

  private checkIfCurrentUser(userId: string): void {
    const currentUserId = this.authService.getCurrentUserId();
    console.log('Current user ID:', currentUserId);
    this.isCurrentUser = userId === currentUserId;
    console.log('Is current user:', this.isCurrentUser);
  }

  updateInformation() {
    this.router.navigate(['/profile/update-information']);
  }
}