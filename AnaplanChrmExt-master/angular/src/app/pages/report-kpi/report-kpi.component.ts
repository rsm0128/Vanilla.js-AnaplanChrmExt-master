import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { TableData, ListFreqLinePageFlt } from '../../models/TableData';
import { AnaWorkspace } from 'src/app/models/anaplanmodel';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-report-kpi',
  templateUrl: 'report-kpi.component.html',
  styles: [`
    table{
      width:100%
    }
  `]
})

export class ReportKpiComponent implements OnInit {



  readonly GBPIPEFILTER = Math.pow(1024, 3);
  readonly CELLFILTER = 1000000;

  public mostusedlist: TableData = {
    showHeaderIdx: [0, 1],
    headerRow: ['List', 'Count'],
    dataRows: []
  };

  public multiDimChartOpt = {
    chart: {
      height: 300,
      type: 'bar',
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }, formatter: (val) => {
        return val;
      }
    },
    series: [{
      name: 'Count',
      data: []
    }],
    xaxis: {
      categories: [],
      position: 'bottom',
      labels: {
        offsetY: 0,

      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: {
        enabled: false,
        enabledOnSeries: false,
        offsetY: -35,
      },
      fill: {
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        show: false,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: (val) => {
            return val + '%';
          }
        }
      },
      title: {
        text: 'Monthly Inflation in Argentina, 2002',
        floating: true,
        offsetY: 320,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    }
  };
  public modelTMScaleChartOpt = {
    chart: {
      type: 'line',
      height: 100,
      animations: {
        enabled: true,
        easing: 'easein',
        speed: 200,
      },
      toolbar: {
        show: false,
      },
      style: {
        fontFamily: 'Montserrat, Helvetica, sans-serif',
      },
    },
    dataLabels: {

    },
    stroke: {
      curve: 'straight',
      lineCap: 'round',
      width: 10
    },
    markers: {
      size: 20,
      shape: 'square',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
    },
    series: [{
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
          fontFamily: 'Montserrat, Arial, sans-serif',
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


  listDataSource = new MatTableDataSource<ListFreqLinePageFlt>();
  listDisplayedColumns = ['name', 'count'];

  @ViewChild('modelTMScaleChart', { static: true }) modelTMScaleChart: ChartComponent;
  @ViewChild('multiDimChart', { static: true }) multiDimChart: ChartComponent;

  @ViewChild('listMatTable', { static: true }) listSort !: MatSort;

  public wsInfo: AnaWorkspace;
  public history: Date[];
  constructor(private anaSvc: AnaplanLoadService) { }

  ngOnInit() {
    this.anaSvc.getCurrentWS().then((res) => {
      this.wsInfo = res;
      try {
        const snapshot = this.wsInfo.model.modelData;
        this.loadTimeScale();


        this.multiDimChartOpt.series[0].data = [];
        this.multiDimChartOpt.xaxis.categories = [];
        const tmpMostUsedObj = {};
        for (const item of snapshot.module.lineItems) {
          const itemCount = item.fullAppliesTo.length;
          if (itemCount in tmpMostUsedObj) {
            tmpMostUsedObj[itemCount]++;
          } else {
            tmpMostUsedObj[itemCount] = 0;
          }
        }
        Object.keys(tmpMostUsedObj).map((key) => {
          this.multiDimChartOpt.xaxis.categories.push(key);
          this.multiDimChartOpt.series[0].data.push(tmpMostUsedObj[key]);
        });
        this.multiDimChart.updateOptions({
          series: this.multiDimChartOpt.series,
          xaxis: this.multiDimChartOpt.xaxis
        }, true, true);

        console.log(snapshot);
        const tmpMostUsedLst: ListFreqLinePageFlt[] = this.anaSvc.getCaculateListFrequency(snapshot);;

        this.listDataSource = new MatTableDataSource(tmpMostUsedLst.slice(0, 5));
        // this.listDataSource = new MatTableDataSource(listData);
        this.listDataSource.sort = this.listSort;


      } catch (err) {
      }
    });

  }
  setTimePeriod(idx) {
    this.anaSvc.setCurTimeRangeIdx(idx);
    this.loadTimeScale();
  }
  loadTimeScale() {
    const snapshot = this.wsInfo.model.modelData;
    const timeInfo = snapshot.time;

    let curTMInfoIdx: number = this.anaSvc.getCurTimeRangeIdx();
    if (curTMInfoIdx < 0 || curTMInfoIdx >= timeInfo.timescales.length) {
      curTMInfoIdx = 0;
    }
    const timeScales = timeInfo.timescales[curTMInfoIdx];
    const timeCategories = [timeScales.labels[0], timeScales.labels[timeScales.labels.length - 1]];
    this.modelTMScaleChartOpt.series[0].data = [1, 1];
    this.modelTMScaleChartOpt.xaxis.categories = timeCategories;
    console.log(this.modelTMScaleChartOpt.xaxis.categories);
    this.modelTMScaleChart.updateOptions({
      xaxis: {
        categories: timeCategories
      }
    }, true, true);
    this.modelTMScaleChart.updateSeries([{
      name: 'version',
      data: [1, 1]
    }], true);

  }
}
