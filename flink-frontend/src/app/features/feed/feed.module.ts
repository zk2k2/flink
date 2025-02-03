import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed/feed.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedSettingsComponent } from './feed/feed-settings/feed-settings.component';

@NgModule({
  declarations: [
    FeedComponent,
    ActivityListComponent,
    FeedSettingsComponent,
  ],
  imports: [CommonModule, SharedModule, FeedRoutingModule],
  exports: [ActivityListComponent, FeedComponent],
})
export class FeedModule {}
