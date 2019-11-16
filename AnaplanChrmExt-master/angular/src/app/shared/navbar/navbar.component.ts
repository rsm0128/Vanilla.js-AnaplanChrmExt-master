import { Component, OnInit, Renderer, ViewChild, ElementRef, Inject } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingWorkspaceDlgComponent } from './workspace/setting-workspace.component';
import { WorkspaceSettingDlgData } from 'src/app/models/workspacesetting';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { AnaWorkspace } from 'src/app/models/anaplanmodel';



@Component({
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {

  constructor(location: Location, private element: ElementRef, private router: Router,
    private dlg: MatDialog, private anaSvc: AnaplanLoadService) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  public wsInfo: AnaWorkspace;
  private listTitles: any[];
  private location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  private dialogOpen = false;

  public isCollapsed = true;
  @ViewChild('navbar-cmp', { static: false }) button;

  private wsdlgData: WorkspaceSettingDlgData;

  ngOnInit() {
    this.listTitles = [];
    ROUTES.map(child => {
      this.listTitles = [...this.listTitles, ...child.children];
    });
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });

    this.anaSvc.getCurrentWS().then((res) => {
      this.wsInfo = res;
      console.log('-------getCurrentWS-------')
      console.log(res);
      try {
        this.wsdlgData = {
          workspaceId: this.wsInfo.code,
          modelId: this.wsInfo.model.code,
          snapshotId: this.wsInfo.model.modelData.version.snapshotName,
        };
      } catch (ex) {
        console.log(ex);
      }
    });

  }
  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    for (const item of this.listTitles) {
      if (item.path === titlee) {
        return item.title;
      }
    }
    return 'Homepage';
  }
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = document.getElementsByClassName('main-panel')[0] as HTMLElement;
    setTimeout(() => {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = document.getElementsByClassName('main-panel')[0] as HTMLElement;
    if (window.innerWidth < 991) {
      setTimeout(() => {
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }
  changeWSSetting() {
    if (this.dialogOpen) {
      return;
    }
    this.dialogOpen = true;
    const dialogRef = this.dlg.open(SettingWorkspaceDlgComponent, {
      width: '350px',
      data: this.wsdlgData
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogOpen = false;
      if (result && result.workspaceId) {
        this.wsdlgData = result;
        this.anaSvc.changeWorkspaceData(this.wsdlgData);
      }
    });
  }

}
