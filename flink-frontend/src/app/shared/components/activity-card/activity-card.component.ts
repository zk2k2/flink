import { Component, Input } from '@angular/core';
import { ActivityCard } from '../../types/ActivityCard';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent {
  @Input()
  activity!: ActivityCard;
}
