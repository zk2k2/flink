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
    label: string;
  };
  details: {
    date: string;
    location: string;
    participants: string;
  };
  description: string;
  image: string;
  
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