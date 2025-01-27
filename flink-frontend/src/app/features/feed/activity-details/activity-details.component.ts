import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-activity-card',
  template: `
    <div class="card" (click)="onClick()">
      <h3>{{ activity.title }}</h3>
      <p>{{ activity.location }}</p>
    </div>
  `
})
export class ActivityCardComponent {
  @Input() activity!: Activity;
  @Output() clicked = new EventEmitter<string>();

  onClick(): void {
    this.clicked.emit(this.activity.id);
  }
}
