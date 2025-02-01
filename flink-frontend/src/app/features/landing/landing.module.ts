import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MatButtonModule } from '@angular/material/button';
import { FeedModule } from '../feed/feed.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LandingRoutingModule, MatButtonModule, FeedModule],
})
export class LandingModule {}
