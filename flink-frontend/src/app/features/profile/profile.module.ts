import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateUserInformationComponent } from './update-user-information/update-user-information.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageNotFoundPipe } from 'src/app/core/pipes/ImageNotFoundPipe';
 

@NgModule({
  declarations: [
    ProfileComponent,
    UserProfileFormComponent,
    UpdateUserInformationComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatSnackBarModule, 
    ImageNotFoundPipe,
 
  ],
})
export class ProfileModule {}
