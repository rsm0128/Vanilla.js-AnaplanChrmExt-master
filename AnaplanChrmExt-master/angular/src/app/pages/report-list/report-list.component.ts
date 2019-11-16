import { Component, OnInit, ViewChild } from '@angular/core';
import { AnaWorkspace, AnaList } from 'src/app/models/anaplanmodel';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { ListPageFilter } from 'src/app/models/TableData';


@Component({
  selector: 'app-report-list',
  templateUrl: 'report-list.component.html',
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

export class ReportListComponent implements OnInit {
  public wsInfo: AnaWorkspace;

  listDataList = [];
  listDisplayedColumnDefs = [{
    headerName: 'Name',
    field: 'name',
  }, {
    headerName: 'Parent',
    field: 'parent',
  }, {
    headerName: 'Numbered',
    field: 'numbered',
    width: 50,
    cellRenderer: params => {
      return `<input type='checkbox' ${params.value ? 'checked' : ''}  disabled="disabled" />`;
    }
  }, {
    headerName: 'Items',
    field: 'items',
    width: 50
  }, {
    headerName: 'Properties',
    field: 'properties',
    width: 50
  }, {
    headerName: 'Subset',
    field: 'subset',
    width: 50
  }];

  defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true
  };

  selectedRow = null;

  constructor(private anaSvc: AnaplanLoadService) { }

  ngOnInit() {
    this.anaSvc.getCurrentWS().then((res) => {
      this.wsInfo = res;
      this.listDataList = this.getDataSource(this.wsInfo.model.modelData.list);
    });
  }

  public getLineItemsCount(ws) {
    if (!ws) {
      return 0;
    }
    if (!ws.model) {
      return 0;
    }
    if (!ws.model.snapshot && !ws.model.snapshot.length) {
      return 0;
    }
    if (!ws.model.snapshot.module) {
      return 0;
    }
    if (!ws.model.snapshot.module.lineItems) {
      return 0;
    }
    if (!ws.model.snapshot.module.lineItems.length) {
      return 0;
    }
    let count = 0;
    for (const item of ws.model.snapshot.module.lineItems) {
      count += item.lineItemInfos.length;
    }
    return count;
  }

  getDataSource(aList: AnaList): ListPageFilter[] {
    if (!aList) {
      return [];
    }

    const res: ListPageFilter[] = [];
    aList.hierachies.forEach((hierachy, index) => {
      res.push({
        idx: index,
        name: this.anaSvc.getNameFromListById(aList, hierachy.entityLongId).name,
        parent: this.anaSvc.getNameFromListById(aList, hierachy.parentHierarchyEntityLongId).name,
        numbered: hierachy.isNumberedList,
        items: hierachy.itemCount,
        properties: hierachy.propertiesLabelPage.count,
        subset: hierachy.subsetEntityLongIds.length,
      });
    });
    // //for testing
    // this.selectedRow = Object.assign(res[3], aList.hierachies[3]);

    return res;
  }

  getState(state: boolean) {
    return state;
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  onRowSelected(event) {
    const idx = event.data.idx;
    const aList = this.wsInfo.model.modelData.list;
    const selHierachy = aList.hierachies[idx];
    this.selectedRow = Object.assign(this.listDataList[idx], selHierachy);
    console.log(this.selectedRow);
  }


}
