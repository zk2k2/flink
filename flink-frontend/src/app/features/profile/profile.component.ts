import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isCurrentUser: boolean = false;
  mockLoggedInUserId = '123'; 

  activities: any[] = []; 

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userid');
      if (userId) {
        this.isCurrentUser = userId === this.mockLoggedInUserId;

        if (userId === this.mockLoggedInUserId) {
          this.user = {
            id: userId,
            image: 'https://via.placeholder.com/150',
            name: 'John Doe',
            followers: 200,
            following: 150,
          };

          this.activities = [
            {
              poster: {
                name: 'John Doe',
                avatar: 'https://thispersondoesnotexist.com/',
                postedOn: 'Posted on 12/01/2025 at 21:04',
              },
              title: 'Team Coding Challenge',
              category: {
                icon: 'code',
                label: 'Technology',
              },
              details: {
                date: 'Mon. 03/02/25 at 14:00',
                location: 'TechHub (Within 10km)',
                participants: '5/8 participants',
              },
              description:
                'A coding challenge for developers to solve real-world problems.',
              image: 'https://picsum.photos/400',
            },
            {
              poster: {
                name: 'John Doe',
                avatar: 'https://thispersondoesnotexist.com/',
                postedOn: 'Posted on 01/12/2025 at 19:45',
              },
              title: 'Angular Meetup',
              category: {
                icon: 'code',
                label: 'Programming',
              },
              details: {
                date: 'Sat. 02/06/25 at 10:00',
                location: 'Google Campus',
                participants: '12/15 participants',
              },
              description:
                'Join us for an exciting session on Angular best practices.',
              image: 'https://picsum.photos/400',
            },
          ];
        } else if (userId === '555') {
          this.user = {
            id: userId,
            image: 'https://via.placeholder.com/150',
            name: 'Alice Johnson',
            followers: 120,
            following: 180,
          };

          this.activities = [
            {
              poster: {
                name: 'Alice Johnson',
                avatar: 'https://thispersondoesnotexist.com/',
                postedOn: 'Posted on 02/02/2025 at 13:45',
              },
              title: 'Tech Startup Pitch Event',
              category: {
                icon: 'business',
                label: 'Business',
              },
              details: {
                date: 'Thu. 05/02/25 at 11:00',
                location: 'Startup Hub (Within 3km)',
                participants: '10/12 participants',
              },
              description:
                'Pitch your startup idea and get feedback from investors.',
              image: 'https://picsum.photos/400',
            },
            {
              poster: {
                name: 'Alice Johnson',
                avatar: 'https://thispersondoesnotexist.com/',
                postedOn: 'Posted on 10/01/2025 at 09:30',
              },
              title: 'Digital Marketing Workshop',
              category: {
                icon: 'work',
                label: 'Marketing',
              },
              details: {
                date: 'Fri. 06/02/25 at 13:00',
                location: 'Marketing Agency',
                participants: '20/20 participants',
              },
              description:
                'A workshop for learning effective digital marketing strategies.',
              image: 'https://picsum.photos/400',
            },
          ];
        } else {
          this.user = {
            id: userId,
            image: 'https://via.placeholder.com/150',
            name: 'Unknown User',
            followers: 0,
            following: 0,
          };

          this.activities = [];
        }
      }
    });
  }

  updateInformation() {
    this.router.navigate(['/profile/update-information']);
  }
}
