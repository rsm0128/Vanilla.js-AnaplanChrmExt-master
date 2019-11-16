import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingWorkspaceDlgComponent } from './workspace/setting-workspace.component';
import { CommonMaterialModule } from 'src/app/common/common.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    CommonMaterialModule
  ],
  declarations: [
    NavbarComponent,
    SettingWorkspaceDlgComponent
  ],
  exports: [
    NavbarComponent,
    SettingWorkspaceDlgComponent
  ],
  entryComponents: [
    SettingWorkspaceDlgComponent
  ]
})

export class NavbarModule { }
