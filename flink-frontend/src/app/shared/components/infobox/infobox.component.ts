import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('void', style({ transform: 'translateY(100%)', opacity: 0 })),
      transition(':enter', [
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-in',
          style({ transform: 'translateY(20px)', opacity: 0 }) // Less movement for smoother effect
        ),
      ]),
    ]),
  ],
})
export class InfoboxComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  timeBarWidth: number = 100; // Initial width of the time bar
  private interval: any;
  private startTime!: number;

  ngOnInit() {
    this.startTime = Date.now();
    this.interval = setInterval(() => this.updateTimeBar(), 10); // Update every 10ms for smooth animation
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  updateTimeBar() {
    const elapsedTime = Date.now() - this.startTime; // Time elapsed in milliseconds
    const totalDuration = 5000; // Total duration in milliseconds (5 seconds)

    if (elapsedTime >= totalDuration) {
      this.closeInfobox();
      return;
    }

    this.timeBarWidth = 100 - (elapsedTime / totalDuration) * 100; // Calculate remaining width
  }

  closeInfobox() {
    setTimeout(() => this.close.emit(), 500); // Match the duration of the fade-out animation
  }
}
