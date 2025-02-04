import { Component, Input } from '@angular/core';

export interface Activity {
  poster: {
    name: string;
    avatar: string;
    postedOn: string;
  };
  title: string;
  category: {
    icon: string;
    name: string;
  };
  date: string;
  location: string;
  description: string;
  photoUrls: string[];
  nbOfParticipants: number;
}

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent {
  @Input()
  activity!: Activity;
}
