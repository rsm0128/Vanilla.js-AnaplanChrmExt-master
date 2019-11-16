import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/report-layout/report-layout.component';

const routes: Routes = [
  // { path: 'popup', component: PopupComponent },
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/report-layout/report-layout.module#AdminLayoutModule'
      }]
  },
  {
    path: '**',
    redirectTo: 'homepage'
  }
  // { path: 'report/kpi', component: ReportComponent },
  // { path: 'report/optimization', component: ReportComponent },
  // { path: 'report/compsnapshot', component: ReportComponent },
  // { path: 'report/detail', component: ReportComponent },
  // { path: 'report/evolution', component: ReportComponent },
  // { path: 'report/importdef', component: ReportComponent },
  // { path: 'report/importmap', component: ReportComponent },
  // { path: 'report/moduleauoc', component: ReportComponent },
  // { path: 'report/wsauic', component: ReportComponent },
  // { path: 'report/auditreport', component: ReportComponent },
  // { path: 'report/wsauic', component: ReportComponent },
  // { path: 'report/oprinreco', component: ReportComponent },
  // { path: 'report', redirectTo: '/report/home' },
  // { path: 'optimization', component: PopupComponent },
  // { path: 'snapshot', component: PopupComponent },
  // { path: 'history', component: HistoryComponent },
  // { path: '**', redirectTo: '/report/detail' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
