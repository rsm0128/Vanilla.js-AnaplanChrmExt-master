import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './report-layout.routing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { HomepageComponent } from '../../pages/homepage/homepage.component';
import { ReportKpiComponent } from '../../pages/report-kpi/report-kpi.component';
import { ReportDetailComponent } from '../../pages/import-detail/report-detail.component';
import { ReportEvolutionComponent } from '../../pages/report-evolution/report-evolution.component';
import { ReportImportDefComponent } from '../../pages/import-def/report-import-def.component';
import { ReportLineitemComponent } from 'src/app/pages/report-lineitem/report-lineitem.component';
import { ReportModuleComponent } from 'src/app/pages/report-module/report-module.component';
import { ReportListComponent } from 'src/app/pages/report-list/report-list.component';
import { PremiumOnlyComponent } from '../../pages/premium-only/premium-only.component';
import { CommonMaterialModule } from 'src/app/common/common.module';
import { ModelSelectComponent } from '../../pages/report-evolution/model-select/model-select.component';
import { AgGridModule } from 'ag-grid-angular';
import { LineItemCatPartialMatchFilter } from 'src/app/pages/report-lineitem/others/lineitem-format-partial-match-filter.component';
import { LineItemFuncPartialMatchFilter } from 'src/app/pages/report-lineitem/others/lineitem-func-partial-match-filter.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    NgApexchartsModule,
    CommonMaterialModule,
    AgGridModule.withComponents([
      ReportLineitemComponent,
      ReportModuleComponent,
      LineItemCatPartialMatchFilter,
      LineItemFuncPartialMatchFilter,
    ]),
  ],
  declarations: [
    HomepageComponent,
    ReportKpiComponent,
    ReportDetailComponent,
    ReportEvolutionComponent,
    ReportImportDefComponent,
    ReportLineitemComponent,
    ReportModuleComponent,
    ReportListComponent,
    PremiumOnlyComponent,
    ModelSelectComponent,
    LineItemCatPartialMatchFilter,
    LineItemFuncPartialMatchFilter,
  ]
})
export class AdminLayoutModule { }
