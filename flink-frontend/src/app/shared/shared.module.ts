import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ActivityCardComponent } from './components/activity-card/activity-card.component';

@NgModule({
  declarations: [SidebarComponent, ActivityCardComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatIconModule

  ],
  exports: [SidebarComponent, MatSidenavModule, MatListModule, MatIconModule, MatCardModule, ActivityCardComponent],
})
export class SharedModule { }
