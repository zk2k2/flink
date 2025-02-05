import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { ActivityDetailsComponent } from './components/activity-details/activity-details.component';
import { EditActivityComponent } from './components/edit-activity/edit-activity.component';

const routes: Routes = [
  { path: '', component: CreateActivityComponent },
  { path: ':id', component: ActivityDetailsComponent },
  { path: 'edit/:id', component: EditActivityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}
