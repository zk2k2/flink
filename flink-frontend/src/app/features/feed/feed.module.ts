import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivityListComponent } from './activity-list/activity-list.component';


@NgModule({
  declarations: [
    FeedComponent,
    ActivityDetailsComponent,
    ActivityListComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule
  ]
})
export class FeedModule { }
