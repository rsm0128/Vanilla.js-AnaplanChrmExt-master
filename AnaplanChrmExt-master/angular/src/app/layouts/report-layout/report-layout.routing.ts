import { Routes } from '@angular/router';

import { HomepageComponent } from '../../pages/homepage/homepage.component';
import { ReportKpiComponent } from '../../pages/report-kpi/report-kpi.component';
import { ReportEvolutionComponent } from '../../pages/report-evolution/report-evolution.component';
import { ReportLineitemComponent } from '../../pages/report-lineitem/report-lineitem.component';
import { ReportModuleComponent } from '../../pages/report-module/report-module.component';
import { ReportListComponent } from '../../pages/report-list/report-list.component';
import { PremiumOnlyComponent } from '../../pages/premium-only/premium-only.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: 'kpi', component: ReportKpiComponent },
  { path: 'lineitem', component: ReportLineitemComponent },
  { path: 'modules', component: ReportModuleComponent },
  { path: 'lists', component: ReportListComponent },
  { path: 'modevolution', component: ReportEvolutionComponent },
  { path: 'wsevolution', component: PremiumOnlyComponent },
  { path: 'listmap', component: PremiumOnlyComponent },
  { path: 'importmap', component: PremiumOnlyComponent },
  { path: 'modelsize', component: PremiumOnlyComponent },
  { path: 'workspacesize', component: PremiumOnlyComponent },
  { path: 'auditreport', component: PremiumOnlyComponent },
  { path: 'optimization', component: PremiumOnlyComponent },
];
