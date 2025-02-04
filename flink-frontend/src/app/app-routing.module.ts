import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'landing', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'feed', canActivate: [AuthGuard],  loadChildren: () => import('./features/feed/feed.module').then(m => m.FeedModule) },
  { path: 'profile', canActivate: [AuthGuard], loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
