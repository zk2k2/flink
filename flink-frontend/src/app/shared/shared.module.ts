import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ModalComponent } from './components/modal/modal.component';
import { InfoboxComponent } from './components/infobox/infobox.component';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    ModalComponent,
    InfoboxComponent,
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
  ],
  exports: [
    SidebarComponent,
    MatCardModule,
    MatIcon,
    NavbarComponent,
    ModalComponent,
    InfoboxComponent,
  ],
})
export class SharedModule {}
