import { Component } from '@angular/core';
import { Activity } from 'src/app/shared/components/activity-card/activity-card.component';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  standalone: false,
})
export class ActivityListComponent {

  mockActivity: Activity = {
      poster: {
        name: 'John Doe',
        avatar: 'https://thispersondoesnotexist.com/',
        postedOn: 'Posted on 12/01/2025 at 21:04',
      },
      title: 'Jam Session at Hard Rock Café',
      category: {
        icon: 'music_note',
        label: 'Music',
      },
      details: {
        date: 'Sun. 02/02/25 at 17:05',
        location: 'Hard Rock Café Tunis (Within 5.6km)',
        participants: '8/10 participants',
      },
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam feugiat posuere laoreet. Mauris at magna sed sapien vehicula sodales. Duis varius porttitor diam ac interdum. Phasellus lacinia tempor elit, non auctor sem sagittis ut.',
      image: 'https://picsum.photos/400',
      
    };
}
