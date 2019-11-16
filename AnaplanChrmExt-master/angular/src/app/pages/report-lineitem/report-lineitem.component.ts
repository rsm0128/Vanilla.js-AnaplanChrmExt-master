import { Component, OnInit, ViewChild, AfterViewInit, ContentChild, AfterContentInit, ElementRef } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { TableData, FunctionFreqLinePageFlt, ListFreqLinePageFlt, ItemDataLinePageFlt, ListSearchResult } from '../../models/TableData';
import { AnaWorkspace, AnaModelData, AnaModule } from 'src/app/models/anaplanmodel';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ProgressSpinnerComponent } from '../../common/progress-spinner/progress-spinner.component';
import { LineItemCatPartialMatchFilter } from 'src/app/pages/report-lineitem/others/lineitem-format-partial-match-filter.component';
import { LineItemFuncPartialMatchFilter } from 'src/app/pages/report-lineitem/others/lineitem-func-partial-match-filter.component';

@Component({
  selector: 'app-report-lineitem',
  templateUrl: 'report-lineitem.component.html',
  styleUrls: ['report-lineitem.component.scss']
})

export class ReportLineitemComponent implements OnInit, AfterContentInit {



  colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560'];
  lineItemFormatChatOpt = {
    chart: {
      height: 200,
      type: 'bar',
      events: {
        click: (chart, context, config) => {
          this.onFilterFormat(config);
        },
        dataPointMouseEnter: (evt, context, config) => {
          console.log('-------dataPointMouseEnter---------');
          console.log(evt, context, config);
          this.cursorType = 'pointer';
        },
        dataPointMouseLeave: (evt, context, config) => {
          // console.log(evt);
          this.cursorType = 'default';
          console.log('-------dataPointMouseLeave---------');
        },
      },
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    colors: this.colors,
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
        horizontal: true,
      }
    },
    dataLabels: {
      position: 'top',
      maxItems: 100,
      hideOverflowingLabels: false,
    },
    series: [{
      name: 'Count',
      data: []
    }],

    xaxis: {
      categories: [],
      labels: {
        show: false,
        style: {
          colors: this.colors,
          fontSize: '14px'
        }
      }
    },
    yaxis: {
      show: true,
    }
  };

  @ViewChild('lineItemFormatChat', { static: true }) lineItemFormatChat: ChartComponent;
  @ViewChild('funcMatTable', { static: true }) funcMatTable !: ElementRef;
  @ViewChild('listMatTable', { static: true }) listMatTable !: ElementRef;
  @ViewChild('itemMatTable', { static: true }) itemMatTable !: ElementRef;

  funcDataList = [];
  funcDisplayedColumnDefs = [{
    headerName: 'Function',
    field: 'name',
  }, {
    headerName: 'Count',
    field: 'count',
    width: 100,
  }
  ];
  listDataList = [];
  listDisplayedColumnDefs = [{
    headerName: 'Function',
    field: 'name',
  }, {
    headerName: 'Count',
    field: 'count',
    width: 100,
  }];

  itemDataList = [];
  public itemDisplayedColumnDefs;
  public itemGetRowHeight;
  public getItemRowHeight;
  public cursorType = 'default';
  defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };
  public wsInfo: AnaWorkspace;
  public overlayRef: OverlayRef;
  public itemGridAPI;
  public frameworkComponents;


  constructor(private anaSvc: AnaplanLoadService, private overlay: Overlay) {

    this.itemDisplayedColumnDefs = [{
      headerName: 'Label',
      field: 'label',
    }, {
      headerName: 'Module',
      field: 'module',
    }, {
      headerName: 'Format',
      field: 'format',
      width: 100,
      filter: 'partialCatMatchFilter',
    }, {
      headerName: 'Formula',
      field: 'formula',
      filter: 'partialFuncMatchFilter',
    }, {
      headerName: 'Applies To',
      field: 'appliesTo',
      cellClass: 'cell-wrap-text',
      cellRenderer: (param) => {
        return param.data.appliesTo.join('<br/>');
      },
      filter: 'partialFuncMatchFilter',
      width: 100
    }, {
      headerName: 'Time',
      field: 'time',
      width: 120
    }, {
      headerName: 'Version',
      field: 'version',
      width: 120
    }];

    this.getItemRowHeight = (params) => {
      return params.data.rowHeight;
    };
    this.frameworkComponents = {
      partialCatMatchFilter: LineItemCatPartialMatchFilter,
      partialFuncMatchFilter: LineItemFuncPartialMatchFilter
    };
  }

  ngOnInit() {
    this.anaSvc.getCurrentWS().then((res) => {
      this.wsInfo = res;
      try {
        const snapshot = this.wsInfo.model.modelData;

        const formatData = this.getFormatsCategories(snapshot.module);
        this.lineItemFormatChatOpt.xaxis.categories = formatData.categority;
        this.lineItemFormatChatOpt.series[0].data = formatData.series;

        this.lineItemFormatChat.updateOptions({
          series: this.lineItemFormatChatOpt.series,
          xaxis: this.lineItemFormatChatOpt.xaxis,
        }, true, true);

        this.funcDataList = this.getCaculateFunctionFrequency(snapshot);
        this.listDataList = this.anaSvc.getCaculateListFrequency(snapshot);
        this.itemDataList = this.getCaculateLineItems(snapshot);

      } catch (err) {
        console.log(err);
      } finally {
        this.disapearProgressSpinner();
      }
    });
  }
  getCaculateLineItems(snapshot: AnaModelData): ItemDataLinePageFlt[] {

    // Labels : anaplan.data.ModelContentCache._modelInfo.moduleInfos[nlineltemsLabelPage.labels
    // Module : anaplan.data.ModelContentCache._modelInfo.modulesLabelPage.labels
    // Format : anaplan.data.ModelContentCache._modelInfo.moduleInfos[nlineltemInfos[nformat.dataType
    // Formula : anaplan.data.ModelContentCache._modelInfo.moduleInfos[nlineltemInfos[nformula
    // Applies To : anaplan.data.ModelContentCache._modelInfo.moduleInfos[nlineltemInfos[X].fullAppliesTo
    // Time : anaplan.data.ModelContentCache._modelInfo.moduleInfos[nlineltemInfos[nleafPeriodTime.entityld
    // Version :
    const res = [];
    try {
      snapshot.module.lineItems.map((item) => {
        item.lineItemInfos.map((lineInfo, index) => {
          // console.log(item.lineItemsLabelPage);
          const appliesTos = lineInfo.fullAppliesTo.map((key) => {
            return this.anaSvc.getNameFromListById(snapshot.list, Number(key)).name;
          }).filter((lst) => {
            return lst;
          });
          res.push({
            label: item.lineItemsLabelPage.labels[0][index],
            module: item.name,
            format: this.convertCategory(lineInfo.format.dataType) || '',
            formula: lineInfo.formula || '',
            appliesTo: appliesTos,
            time: lineInfo.leafPeriodType.entityId || '',
            version: lineInfo.versionSelection.entityId || '',
            rowHeight: appliesTos.length * 28
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
    return res;
  }


  getFormatsCategories(modules: AnaModule) {
    const lineItems = modules.lineItems;
    const res = {};
    for (const line of lineItems) {
      // console.log(line);
      for (const lineInfo of line.lineItemInfos) {
        const type = lineInfo.format.dataType;

        if (type in res) {
          res[type]++;
        } else {
          res[type] = 1;
        }
      }
    }
    const sortRes = Object.keys(res).map((key) => {
      return [key, Number(res[key])];
    }).sort((a, b) => {
      return Number(b[1]) - Number(a[1]);
    });
    console.log('sortRes');
    console.log(sortRes);
    return {
      series: sortRes.map((item) => item[1]),
      categority: sortRes.map((item) => {
        return this.convertCategory(String(item[0]));
      })
    };
  }
  private convertCategory(word: string) {
    switch (word) {
      case 'ENTITY':
        return 'LIST';
      case 'TIME_ENTITY':
        return 'TIME';
    }
    return word;
  }

  getCaculateFunctionFrequency(snapShot: AnaModelData): FunctionFreqLinePageFlt[] {

    const lineItems = snapShot.module.lineItems;
    const functions = {};
    snapShot.module.lineItems.map((line) => {
      line.lineItemInfos.map((lineInfo) => {
        if (lineInfo.formula && typeof (lineInfo.formula) === 'string') {
          if (lineInfo.formula in functions) {
            functions[lineInfo.formula]++;
          } else {
            functions[lineInfo.formula] = 1;
          }
        }
      });
    });
    const aCompList = this.anaSvc.getAutocompleteFunctionList();
    const candidate = [];
    aCompList.map((bFunc) => {
      candidate[bFunc] = 0;
      Object.keys(functions).map((aFunc) => {
        if (aFunc.includes(bFunc)) {
          candidate[bFunc] += functions[aFunc];
        }
      });
    });
    console.log(candidate);
    return Object.keys(candidate).map((key): FunctionFreqLinePageFlt => {
      return {
        name: key + ')',
        count: Number(candidate[key])
      };
    }).sort((a, b) => {
      return b.count - a.count;
    });
  }

  getLineItemsCount(ws) {
    return this.anaSvc.getLineItemsCount(ws);
  }

  // Display progress spinner for 3 secs on click of button
  showProgressSpinner = () => {
    // this.showGlobalOverlay();
  }
  disapearProgressSpinner = () => {
    // setTimeout(() => this.overlayRef.detach(), 1000);
  }

  showGlobalOverlay() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
      backdropClass: 'backDropsCls'
    });
    this.overlayRef.attach(new ComponentPortal(ProgressSpinnerComponent));

  }
  ngAfterContentInit(): void {
    this.showProgressSpinner();
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    console.log(params);
  }
  onItemGridReady(params) {
    params.api.sizeColumnsToFit();
    console.log(params);
    this.itemGridAPI = params.api;
  }

  onFilterFormat(data) {
    console.log(data.dataPointIndex);
    console.log(data.seriesIndex);
    const searchWord = data.config.xaxis.categories[data.dataPointIndex];
    if (searchWord) {
      this.itemGridAPI
        .getFilterInstance('format')
        .getFrameworkComponentInstance()
        .formatSearchFilter(searchWord);
    }
  }

  onListRowDoubleClicked(event) {
    const listName = event.data.name;
    console.log(event.data);
    if (listName) {

      this.itemGridAPI
        .getFilterInstance('appliesTo')
        .getFrameworkComponentInstance()
        .listSearchFilter(listName);
    }
  }

  onFuncRowDoubleClicked(event) {
    let funcName = event.data.name;
    if (funcName) {
      if (funcName[funcName.length - 1] === ')') {
        funcName = funcName.substr(0, funcName.length - 1);
      }
      this.itemGridAPI
        .getFilterInstance('formula')
        .getFrameworkComponentInstance()
        .funcSearchFilter(funcName);
    }
  }

  isSearchTextExist() {
    try {
      return this.itemGridAPI
        .getFilterInstance('format')
        .getFrameworkComponentInstance()
        .getModel().value ||
        this.itemGridAPI
          .getFilterInstance('appliesTo')
          .getFrameworkComponentInstance()
          .getModel().value ||
        this.itemGridAPI
          .getFilterInstance('formula')
          .getFrameworkComponentInstance()
          .getModel().value;
    } catch (error) {
      return false;
    }
  }
  clearFilterParameter() {
    this.itemGridAPI
      .getFilterInstance('format')
      .getFrameworkComponentInstance()
      .formatSearchFilter('');
    this.itemGridAPI
      .getFilterInstance('appliesTo')
      .getFrameworkComponentInstance()
      .listSearchFilter('');
    this.itemGridAPI
      .getFilterInstance('formula')
      .getFrameworkComponentInstance()
      .funcSearchFilter('');
  }
}
