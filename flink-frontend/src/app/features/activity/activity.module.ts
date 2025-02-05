import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { CreateActivityFormComponent } from './components/create-activity-form/create-activity-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivityDetailsComponent } from './components/activity-details/activity-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivityRoutingModule } from './activity-routing.module';
import { CustomDatePipe } from 'src/app/core/pipes/CustomDataPipe';
import { ImageNotFoundPipe } from 'src/app/core/pipes/ImageNotFoundPipe';

@NgModule({
  declarations: [
    CreateActivityComponent,
    CreateActivityFormComponent,
    ActivityDetailsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ActivityRoutingModule,
    CustomDatePipe,
    ImageNotFoundPipe,
  ],
  exports: [CreateActivityComponent, ActivityDetailsComponent],
})
export class ActivityModule {}
