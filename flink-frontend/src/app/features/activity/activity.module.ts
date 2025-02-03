import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { CreateActivityFormComponent } from './components/create-activity-form/create-activity-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivityDetailsComponent } from './components/activity-details/activity-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CreateActivityComponent,
    CreateActivityFormComponent,
    ActivityDetailsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [CreateActivityComponent, ActivityDetailsComponent],
})
export class ActivityModule {}
