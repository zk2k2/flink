import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { ActivityDetailsComponent } from './components/activity-details/activity-details.component';

const routes: Routes = [
  { path: '', component: CreateActivityComponent },
  { path: ':id', component: ActivityDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}
