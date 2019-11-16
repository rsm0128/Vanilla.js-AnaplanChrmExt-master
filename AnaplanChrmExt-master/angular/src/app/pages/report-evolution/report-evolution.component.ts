import { Component, NgZone, OnInit, ViewChild, ɵCompiler_compileModuleSync__POST_R3__, ViewChildren } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { SnapshotModel, ModuleDifferenceModel, LineItemDifferenceModel, VersionDifferenceModel } from '../../models/TableData';
/* Imports */
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { AnaWorkspace } from 'src/app/models/anaplanmodel';

@Component({
  selector: 'app-report-evolution',
  templateUrl: 'report-evolution.component.html',
  styles: [`
    #moduleChartdiv: {
      height:405px;
    }
    .moduleChartdiv {
      height:370px;
    }
  `]
})

export class ReportEvolutionComponent implements OnInit {

  // public mostusedlist: TableData;

  colors = ['#546E7A', '#FF4560', '#00E396', '#008FFB'];

  constructor(private zone: NgZone, private anaSvc: AnaplanLoadService) { }
  public moduleDiffChartOpt = {
    chart: {
      height: 300,
      type: 'rangeBar',
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    colors: this.colors,
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top'
        }
      }
    },
    fill: {
      colors: this.colors
    },
    dataLabels: {
      enabled: true
    },
    series: [],
    yaxis: {
      min: 231 * 0.95,
      forceNiceScale: true,
    }
  };

  public lineItemDiffChartOpt = {
    chart: {
      height: 300,
      type: 'rangeBar',
    },
    colors: this.colors,
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top'
        }
      }
    },
    fill: {
      colors: this.colors
    },
    dataLabels: {
      enabled: true
    },
    series: [],
    yaxis: {
      min: 1753 * 0.95,
      forceNiceScale: true,
    }
  };

  public modelTMScaleChartOpt = {
    chart: {
      type: 'line',
      height: 100,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {

    },
    stroke: {
      curve: 'straight',
      lineCap: 'round',
      width: 4
    },
    markers: {
      size: 10,
      shape: 'square',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
    },
    series: [{
      data: []
    }, {
      data: []
    }],
    grid: {
      show: false
    },
    xaxis: {
      categories: [],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      tickPlacement: 'between',
      crosshairs: {
        show: false
      },
      labels: {
        style: {
          fontSize: '16px',
        },
        offsetX: 2
      }

    },
    yaxis: {
      tickAmount: 0,
      show: false,
      showAlways: false
    },
    tooltip: {
      enabled: false,
      enabledOnSeries: false,
      x: {
        show: false,
      }
    },
  };

  snapshotModel: SnapshotModel = {
    modelList: [],
    modelId1: '',
    snapshotId1: '',

    modelId2: '',
    snapshotId2: '',
    wsInfo1: null,
    wsInfo2: null,
  };

  moduleDiffs: ModuleDifferenceModel = {
    applies: 25,
    timeGranularity: 3,
    moduleNameChanes: 6,
  };

  lineItemDiffs: LineItemDifferenceModel = {
    formula: 0,
    applies: 0,
    liname: 0,
  };
  versionDiffs: VersionDifferenceModel = {
    append: 1,
    renamed: 0,
    deteled: 6,
  };


  @ViewChild('modelTMScaleChart', { static: true }) modelTMScaleChart: ChartComponent;
  @ViewChild('lineItemDiffChart', { static: true }) lineItemDiffChart: ChartComponent;
  @ViewChild('moduleDiffChart', { static: true }) moduleDiffChart: ChartComponent;

  //////////////////////////////// amchart

  // @ViewChildren(ModelSelectComponent) selectComps: Array<ModelSelectComponent>;

  ngOnInit() {
    // SnapshotModel
    this.anaSvc.getModelVersionListByWorkspace().then((res) => {
      console.log('-------getModelVersionListByWorkspace----------');
      console.log(res);

      this.snapshotModel.modelList = res;
      this.snapshotModel.modelId1 = this.snapshotModel.modelList[0].code;
      const snapshots = this.snapshotModel.modelList[0].snapshots;
      this.snapshotModel.snapshotId1 = snapshots[snapshots.length - 1];
      this.snapshotModel.modelId2 = this.snapshotModel.modelList[0].code;
      this.snapshotModel.snapshotId2 = this.snapshotModel.snapshotId1;
      // this.selectComps.map((comp) => comp.modelChanged());

    });
  }

  calcDifferences(res) {
    console.log('--------calcModulesDifference--------');
    console.log(this.snapshotModel);
    if (res.idx === 1) {
      this.snapshotModel.wsInfo1 = res.data;
      this.loadTimeScale(this.snapshotModel.wsInfo1, 0);
    } else {
      this.snapshotModel.wsInfo2 = res.data;
      this.loadTimeScale(this.snapshotModel.wsInfo2, 1);
    }
    this.calcModulesDifference(this.snapshotModel);
    this.calcLineItemDifference(this.snapshotModel);
    this.calcVersionDifference(this.snapshotModel);

  }
  calcVersionDifference(ssm: SnapshotModel) {
    if (!ssm.wsInfo1 || !ssm.wsInfo2) {
      return {};
    }

    // For Codes
    const version1 = ssm.wsInfo1.model.modelData.version;
    const version2 = ssm.wsInfo2.model.modelData.version;
    const codes1 = version1.code;
    const codes2 = version2.code;
    // For Test
    const diffs = this.missingElementTwoArray(codes1, codes2, true);
    const module1CodeMissings = diffs.first;
    const module2CodeMissings = diffs.second;
    const moduleCodeSame = diffs.share;
    console.log(module1CodeMissings);
    console.log(module2CodeMissings);
    this.versionDiffs = {
      append: diffs.second.length,
      deteled: diffs.first.length,
      renamed: moduleCodeSame.filter((key) => {
        const idx1 = codes1.indexOf(key);
        const idx2 = codes2.indexOf(key);
        return version1.name[idx1] !== version2.name[idx2];
      }).length,
    };

  }


  modelchanged(evt, idx: number = 0) {
    if (idx === 0) {
      this.snapshotModel.modelId1 = evt.target.value;
    } else {
      this.snapshotModel.modelId2 = evt.target.value;
    }
  }


  missingElementTwoArray(array1, array2, isShare: boolean = false) {
    return {
      first: array1.filter(item => array2.indexOf(item) < 0),
      second: array2.filter(item => array1.indexOf(item) < 0),
      share: isShare ? array2.filter(item => array1.indexOf(item) >= 0) : []
    };
  }

  calcModulesDifference(ssm: SnapshotModel) {
    if (!ssm.wsInfo1 || !ssm.wsInfo2) {
      return {};
    }

    // For Codes
    const codes1 = ssm.wsInfo1.model.modelData.module.code;
    const codes2 = ssm.wsInfo2.model.modelData.module.code;
    const codeDiffs = this.missingElementTwoArray(codes1, codes2, true);
    const module1CodeMissings = codeDiffs.first;
    const module2CodeMissings = codeDiffs.second;
    console.log(module1CodeMissings);
    console.log(module2CodeMissings);

    // fullAppies
    const calcDifferentModules = ((items1, items2, keys1, keys2, shareCodes) => {
      this.moduleDiffs = {
        applies: 0,
        timeGranularity: 0,
        moduleNameChanes: 0,
      };

      shareCodes.forEach((code) => {
        const idx1 = keys1.indexOf(code);
        const idx2 = keys2.indexOf(code);
        if (items1[idx1].fullAppliesTo.length !== items2[idx2].fullAppliesTo.length) {
          this.moduleDiffs.applies++;
        }
        if (items1[idx1].periodType !== items2[idx2].periodType) {
          this.moduleDiffs.timeGranularity++;
        }
        if (items1[idx1].name !== items2[idx2].name) {
          this.moduleDiffs.moduleNameChanes++;
        }
      });
    });

    const shareCodes = codeDiffs.share;
    calcDifferentModules(ssm.wsInfo1.model.modelData.module.lineItems,
      ssm.wsInfo2.model.modelData.module.lineItems,
      ssm.wsInfo1.model.modelData.module.code,
      ssm.wsInfo2.model.modelData.module.code,
      shareCodes);

    this.moduleDiffChartOpt.series = [
      {
        name: 'Snapshot 1',
        data: [{
          x: '',
          y: [0, codes1.length]
        }]
      }, {
        name: 'Deletions',
        data: [{
          x: '',
          y: [codes1.length - module1CodeMissings.length, codes1.length]
        }]
      }, {
        name: 'Additions',
        data: [{
          x: '',
          y: [codes1.length - module1CodeMissings.length, codes1.length - module1CodeMissings.length + module2CodeMissings.length]
        }]
      }, {
        name: 'Snapshot 2',
        data: [{
          x: '',
          y: [0, codes2.length]
        }]
      }];

    this.moduleDiffChart.updateOptions({
      series: this.moduleDiffChartOpt.series,
      yaxis: {
        min: (codes1.length - module1CodeMissings.length) * 0.95,
        forceNiceScale: true,
      }
    }, true, true);


  }


  calcLineItemDifference(ssm: SnapshotModel) {
    if (!ssm.wsInfo1 || !ssm.wsInfo2) {
      return {};
    }



    const mergeLineItemsBytId = (lineItems: any[]) => {
      let res = [];
      for (const item of lineItems) {
        const ids = item.lineItemsLabelPage.entityLongIds[0].map((id, index) => {
          return {
            code: id,
            formula: item.lineItemInfos[index].formula,
            leafPeriodType: item.lineItemInfos[index].leafPeriodType.entityId,
            label: item.lineItemsLabelPage.labels[0][index]
          };
        });
        if (ids && ids.length > 0) {
          res = [...res, ...ids];
        }
      }
      return res;
    };
    const lineItems1 = mergeLineItemsBytId(ssm.wsInfo1.model.modelData.module.lineItems);
    const lineItems2 = mergeLineItemsBytId(ssm.wsInfo2.model.modelData.module.lineItems);
    const codes1 = lineItems1.map((item) => item.code);
    const codes2 = lineItems2.map((item) => item.code);

    const codeDiffs = this.missingElementTwoArray(codes1, codes2, true);
    const lineItem1Missings = codeDiffs.first;
    const lineItem2Missings = codeDiffs.second;
    const shareCodes = codeDiffs.share;
    // const shareCodes

    const calcDifferentLineItems = ((items1, items2, keys1, keys2, shareCodes) => {
      this.lineItemDiffs = {
        formula: 0,
        applies: 0,
        liname: 0,
      };

      shareCodes.forEach((code) => {
        const idx1 = keys1.indexOf(code);
        const idx2 = keys2.indexOf(code);

        if (items1[idx1].formula !== items2[idx2].formula) {
          this.lineItemDiffs.formula++;
        }
        if (items1[idx1].leafPeriodType !== items2[idx2].leafPeriodType) {
          this.lineItemDiffs.applies++;
        }
        if (items1[idx1].label !== items2[idx2].label) {
          this.lineItemDiffs.liname++;
        }
      });
    });

    calcDifferentLineItems(lineItems1, lineItems2, codes1, codes2, shareCodes);


    this.lineItemDiffChartOpt.series = [
      {
        name: 'Snapshot 1',
        data: [{
          x: '',
          y: [0, codes1.length]
        }]
      }, {
        name: 'Deletions',
        data: [{
          x: '',
          y: [codes1.length - lineItem1Missings.length, codes1.length]
        }]
      }, {
        name: 'Additions',
        data: [{
          x: '',
          y: [codes1.length - lineItem1Missings.length, codes1.length - lineItem1Missings.length + lineItem2Missings.length]
        }]
      }, {
        name: 'Snapshot 2',
        data: [{
          x: '',
          y: [0, codes2.length]
        }]
      }];

    this.lineItemDiffChart.updateOptions({
      series: this.lineItemDiffChartOpt.series,
      yaxis: {
        min: (codes1.length - lineItem1Missings.length) * 0.95,
        forceNiceScale: true,
      }
    }, true, true);

  }

  loadTimeScale(wsInfo: AnaWorkspace, index) {
    try {
      console.log(wsInfo);
      const modelData = wsInfo.model.modelData;
      const timeInfo = modelData.time;

      let curTMInfoIdx: number = this.anaSvc.getCurTimeRangeIdx();

      if (curTMInfoIdx < 0 || curTMInfoIdx >= timeInfo.timescales.length) {
        curTMInfoIdx = 0;
      }
      const timeScales = timeInfo.timescales[curTMInfoIdx];
      const timeCategories = [timeScales.labels[index], timeScales.labels[timeScales.labels.length - 1]];
      this.modelTMScaleChartOpt.series[index].data = [1 + index, 1 + index];
      this.modelTMScaleChartOpt.xaxis.categories = timeCategories;
      console.log(this.modelTMScaleChartOpt.xaxis.categories);

      this.modelTMScaleChart.updateOptions({
        xaxis: this.modelTMScaleChartOpt.xaxis,
        series: this.modelTMScaleChartOpt.series
      }, true, true);
    } catch (error) {
      console.log(error);
    }
  }
}
