import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { TableData } from '../../models/TableData';


@Component({
  selector: 'app-report-import-def',
  templateUrl: 'report-import-def.component.html'
})

export class ReportImportDefComponent implements OnInit {

  public mostusedlist: TableData;

  lineItemSize = '53.7';

  public username = 'XXX';
  public modelID = 'XXX';
  public workspaceID = 'XXX';

  public chartModuleOpt = {
    chart: {
      height: 350,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    dataLabels: {
      enabled: true
    },
    series: [{
      data: [{
        x: '+200',
        y: [0, 6]
      }, {
        x: '-50',
        y: [4, 6]
      }, {
        x: '+300',
        y: [4, 10]
      }, {
        x: 'Team D',
        y: [0, 10]
      }]
    }],
  };
  public chartLinesOpt = {
    chart: {
      height: 350,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    dataLabels: {
      enabled: true
    },
    series: [{
      data: [{
        x: '+200',
        y: [0, 6]
      }, {
        x: '-50',
        y: [4, 6]
      }, {
        x: '+300',
        y: [4, 10]
      }, {
        x: 'Team D',
        y: [0, 10]
      }]
    }],
  };
  public chartListsOpt = {
    chart: {
      height: 350,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    dataLabels: {
      enabled: true
    },
    series: [{
      data: [{
        x: '+200',
        y: [0, 6]
      }, {
        x: '-50',
        y: [4, 6]
      }, {
        x: '+300',
        y: [4, 10]
      }, {
        x: 'Team D',
        y: [0, 10]
      }]
    }],
  };
  public chartPropertiesOpt = {
    chart: {
      height: 350,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    dataLabels: {
      enabled: true
    },
    series: [{
      data: [{
        x: '+200',
        y: [0, 6]
      }, {
        x: '-50',
        y: [4, 6]
      }, {
        x: '+300',
        y: [4, 10]
      }, {
        x: 'Team D',
        y: [0, 10]
      }]
    }],
  };

  modelList = [1, 2, 4, 5];
  versionlList = [1, 2, 4, 5];
  moduleParam = {
    cal: 25,
    avlFrm: 3,
    multiDim: 6
  }
  importParam = {
    new: 0,
    deleted: 0,
    defCommon: 6,
    dataRoute: 3
  }
  versionDiffs = {
    recommended: 1,
    version: 0,
    deteled: 6,
  }

  @ViewChild('chartLists', { static: true }) chartLists: ChartComponent;
  @ViewChild('chartProperties', { static: true }) chartProperties: ChartComponent;
  @ViewChild('chartLines', { static: true }) chartLines: ChartComponent;
  @ViewChild('chartModule', { static: true }) chartModule: ChartComponent;

  ngOnInit() {
  }
}
