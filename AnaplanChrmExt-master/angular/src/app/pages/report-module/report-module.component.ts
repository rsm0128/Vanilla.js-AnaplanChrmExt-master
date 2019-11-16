import { Component, OnInit, ViewChild } from '@angular/core';
import { ModuelPageFilter } from '../../models/TableData';
import { AnaWorkspace, AnaModelData, AnaModule } from 'src/app/models/anaplanmodel';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { MatTableDataSource } from '@angular/material/table';







@Component({
  selector: 'app-report-module',
  templateUrl: 'report-module.component.html',
  styles: [`
    table {
      width: 100%;
    }

    .mat-form-field {
      font-size: 14px;
      width: 100%;
    }

    .pro-title {
      font-weight: bold;
      width: 100%;
    }
    .pro-content {
      /*font-style: bold;*/
    }
  `]
})

export class ReportModuleComponent implements OnInit {
  public wsInfo: AnaWorkspace;

  // # modules : anaplan.data.ModelContentCache._modelInfo.modulesLabelPage.count
  // # line items : anaplan.data.ModelContentCache._modelInfo.moduleInfos[X].lineItemInfos.length

  // - Name : anaplan.data.ModelContentCache._modelInfo.modulesLabelPage.labels[0][X]
  // - Applies To : anaplan.data.ModelContentCache._modelInfo.moduleInfos[X].appliesTo (but return the lists
  // - Time Range : anaplan.data.ModelContentCache._modelInfo.moduleInfos[X].timegougeLabel
  // - Period Type : anaplan.data.ModelContentCache._modelInfo.moduleInfos[X].leafPeriodType.entityLabel
  // - Version : anaplan.data.ModelContentCache._modelInfo.moduleInfos[X].versionSeledion.entityLabel
  // - # Line Items : anaplan.data.ModelContentCache._modelInfo.moduleInfos[X].lineItemInfos.length
  // - Line Items (array displayed as list) :
  // anaplan.data.ModelContentCache._modelInfo.moduleInfos[0].lineltemsLabelPage.labels[0]

  public selectedRow: any = null;
  modelDataList = [];
  modelDisplayedColumnDefs = [{
    headerName: 'Name',
    field: 'name',
  }, {
    headerName: 'Applies To',
    field: 'appliesTo',
    cellRenderer: (param) => {
      try {
        return param.data.appliesTo.length;
      } catch (error) {
        return 0;
      }
    },
    width: 60,
  }, {
    headerName: 'Time Range',
    field: 'timeRange',
    width: 80
  }, {
    headerName: 'Period Type',
    field: 'periodType',
    width: 100
  }, {
    headerName: 'Version',
    field: 'version',
    width: 100
  },
  {
    headerName: 'Line Items', field: 'lineitems',
    cellRenderer: (param) => {
      try {
        return param.data.lineitems.length;
      } catch (error) {
        return 0;
      }
    },
    width: 60,
  },
  ];
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  constructor(private anaSvc: AnaplanLoadService) {
  }
  ngOnInit() {
    this.anaSvc.getCurrentWS().then((res) => {
      this.wsInfo = res;
      this.modelDataList = this.getDataSource(this.wsInfo.model.modelData.module);
    });
  }


  getDataSource(modules: AnaModule): ModuelPageFilter[] {
    if (!modules.lineItems) {
      return [];
    }
    const res = [];
    modules.lineItems.forEach((item, index) => {
      const linItems = this.getFormulaList(item.lineItemInfos);
      res.push({
        idx: index,
        name: item.name,
        appliesTo: this.getNamesFromAppliesTo(item.appliesTo),
        timeRange: item.timeRange,
        periodType: item.periodType,
        version: item.version,
        lineitems: linItems,
      });
    });
    // for testing
    this.selectedRow = res[2];
    console.log(this.selectedRow);
    return res;
  }
  getNamesFromAppliesTo(lists: string[]) {
    // console.log(lists);
    const res = [];
    if (lists && lists.length) {
      for (const id of lists) {
        const rlt = this.anaSvc.getNameFromListById(this.wsInfo.model.modelData.list, +id);
        if (rlt.name) {
          res.push(rlt.name);
        }
      }
    }
    return res;
  }
  getFormulaList(lineInfors) {
    const formulas = [];
    lineInfors.forEach((line) => {
      if (line.formula) {
        formulas.push(line.formula);
      }
    });
    return formulas;

  }
  getLineItemsCount(ws) {
    return this.anaSvc.getLineItemsCount(ws);
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }
  onRowSelected(event) {
    const idx = event.data.idx;
    this.selectedRow = this.modelDataList[idx];
    console.log(this.selectedRow);
  }


}


