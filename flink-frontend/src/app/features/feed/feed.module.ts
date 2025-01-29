import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed/feed.component';
import { ActivityListComponent } from './activity-list/activity-list.component';


@NgModule({
  declarations: [
    FeedComponent,
    ActivityListComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule
  ]
})
export class FeedModule { }
