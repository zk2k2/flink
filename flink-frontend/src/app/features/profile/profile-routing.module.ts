import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { UpdateUserInformationComponent } from './update-user-information/update-user-information.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'update-information', component: UpdateUserInformationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
