import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  premium: boolean;
}

export interface RouteInfos {
  title: string;
  children: RouteInfo[];
}

export const ROUTES: RouteInfos[] = [{
  title: 'HOME PAGE',
  children: [{ path: '/homepage', title: 'Homepage', icon: 'nc-circle-10', class: '', premium: false }],
}, {
  title: 'STRUCTURE',
  children: [
    { path: '/kpi', title: 'KPI', icon: 'nc-layout-11', class: '', premium: false },
    { path: '/lineitem', title: 'Line Items Analysis', icon: 'nc-tile-56', class: '', premium: true },
    { path: '/modules', title: 'Modules', icon: 'nc-bullet-list-67', class: '', premium: false },
    { path: '/lists', title: 'Lists', icon: 'nc-bullet-list-67', class: '', premium: false },

  ],
}, {
  title: 'EVOLUTION',
  children: [
    { path: '/wsevolution', title: 'WS Evolution (V2)', icon: 'nc-sound-wave', class: '', premium: true },
    { path: '/modevolution', title: 'Model Evolution', icon: 'nc-sound-wave', class: '', premium: true },
  ],
}, {
  title: 'MAPS',
  children: [
    { path: '/listmap', title: 'List Map (V2)', icon: 'nc-map-big', class: '', premium: true },
    { path: '/importmap', title: 'Import Map (V2)', icon: 'nc-map-big', class: '', premium: true },
  ],
}, {
  //nc-chart-bar-32
  title: 'SIZE',
  children: [
    // { path: '/detailed', title: 'Detailed Structure', icon: 'nc-single-copy-04', class: '', premium: false },
    // { path: '/importdef', title: 'Import Definition', icon: 'nc-tile-56', class: '', premium: false },
    { path: '/workspacesize', title: 'WS Allocation (V2)', icon: 'nc-chart-pie-36', class: '', premium: true },
    { path: '/modelsize', title: 'Model Size Review (V3)', icon: 'nc-chart-pie-36', class: '', premium: true },
  ],
}, {
  title: 'AUDIT',
  children: [
    { path: '/optimization', title: 'Optimization (V4)', icon: 'nc-spaceship', class: '', premium: true },
    { path: '/auditreport', title: 'Audit Report (V4)', icon: 'nc-single-copy-04', class: '', premium: true },
  ],
}];

@Component({

  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styles: [
    `
    .mysidespace li > a {
      padding: 0px;
    }
    `
  ],
})

export class SidebarComponent implements OnInit {
  public menuItemGroup: any[];
  ngOnInit() {
    this.menuItemGroup = ROUTES.filter(menuItem => menuItem);
    console.log(this.menuItemGroup);
  }

}
