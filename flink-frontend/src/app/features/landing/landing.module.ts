import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MatButtonModule } from '@angular/material/button';
import { FeedModule } from '../feed/feed.module';
import { ExampleCardComponent } from './example-card/example-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LandingComponent, ExampleCardComponent],
  imports: [CommonModule, LandingRoutingModule, MatButtonModule, FeedModule, SharedModule],
  exports:[LandingComponent]
})
export class LandingModule {}
