import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';

const routes: Routes = [
  { 
    path: '', 
    component: FeedComponent,
    children: [
      { path: 'activity/:id', component: ActivityDetailsComponent },
      { path: '', component: ActivityListComponent } // List of activities
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedRoutingModule { }
