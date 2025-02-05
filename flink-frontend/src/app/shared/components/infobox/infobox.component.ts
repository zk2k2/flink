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
          style({ transform: 'translateY(20px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class InfoboxComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  timeBarWidth: number = 100;
  private interval: any;
  private startTime!: number;

  ngOnInit() {
    this.startTime = Date.now();
    this.interval = setInterval(() => this.updateTimeBar(), 10);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  updateTimeBar() {
    const elapsedTime = Date.now() - this.startTime;
    const totalDuration = 5000;

    if (elapsedTime >= totalDuration) {
      this.closeInfobox();
      return;
    }

    this.timeBarWidth = 100 - (elapsedTime / totalDuration) * 100;
  }

  closeInfobox() {
    setTimeout(() => this.close.emit(), 500);
  }
}
