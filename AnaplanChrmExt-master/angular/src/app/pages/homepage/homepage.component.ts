import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { AnaWorkspace, AnaModel } from 'src/app/models/anaplanmodel';

@Component({
  selector: 'app-homepage',
  templateUrl: 'homepage.component.html',
  styles: [
    `
      .card-category {
        color: #1e1818;
      }
      .model-size {
        color: #1f1f1f;
        font-size: 80px;
        font-weight: bold;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .box {
        box-shadow: 0px 1px 22px -12px #607D8B;
        background-color: #fff;
        padding: 25px 35px 25px 30px;
      }

    `
  ]
})

export class HomepageComponent implements OnInit {

  // @ViewChild('wsChartSize', { static: true }) wsChartSize: ChartComponent;
  @ViewChild('modelChartSize', { static: true }) modelChartSize: ChartComponent;
  @ViewChild('modelChartHistory', { static: true }) modelChartHistory: ChartComponent;
  @ViewChild('modelChartQuantity', { static: true }) modelChartQuantity: ChartComponent;
  @ViewChild('wsUsagesChat', { static: true }) wsUsagesChat: ChartComponent;
  @ViewChild('modelSizeChat', { static: true }) modelSizeChat: ChartComponent;

  readonly routerLink = {
    kpi: '/kpi'
  };
  wsChartSizeSetting = {
    chart: {
      type: 'pie',
      height: 235,
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    series: [],
    labels: ['Used', 'Free'],
    dataLabels: {
      enabled: true,
      formatter: (value, { seriesIndex, w }) => {
        if (w.config.labels[seriesIndex] === 'Free') {
          return '';
        }
        return w.config.labels[seriesIndex] + ' ' + (+value).toFixed(2) + '%';
      }
    },
    legend: {
      show: false
    }
  };

  modelChartSizeOpt = {
    chart: {
      type: 'pie',
      height: 235,
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    series: [{ data: [100, 20] }],
    labels: ['Model Size', 'Other Models'],
    dataLabels: {
      enabled: true,
      formatter: (value, { seriesIndex, w }) => {
        if (w.config.labels[seriesIndex] === 'Other Models') {
          return '';
        }
        return w.config.labels[seriesIndex] + ' ' + (+value).toFixed(2) + '%';
      },
    },
    legend: {
      show: false
    },
    tooltip: {
      x: {
        formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
          return value;
        }
      }
    }
  };

  modelChartHistoryOpt = {
    chart: {
      type: 'line',
      height: '130',
      width: '100%',
      // id: 'snapshothistory',
      // group: 'sparklines',
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
        },
        autoSelected: 'zoom'
      },
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    series: [{
      name: 'Snapshot',
      data: []
    }],
    title: {
      align: 'left'
    },
    stroke: {
      show: true,
      width: 0,
    },
    markers: {
      size: 10
    },
    xaxis: {
      show: true,
      type: 'datetime',
      labels: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm',
        },
      },
    },
    grid: {
      show: false,
    },
    yaxis: [
      {
        min: -1,
        max: 1,
        show: false,
        tooltip: {
          enabled: false
        },
      }],
    tooltip: {
      enabled: true,
      enabledOnSeries: false,
      x: {
        show: false,
      }
    },
    dataLabels: {
      enabled: false
    }
  };


  modelSizeChatOpts = {
    chart: {
      id: 'modelSizesparkline',
      group: 'sparklines',
      type: 'area',
      height: 130,
      sparkline: {
        enabled: true
      },
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 1,
    },
    series: [{
      name: 'Models',
      data: []
    }],
    labels: [],
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'number',
    },
    colors: ['#008FFB'],
    markers: {
      size: 4,
    },
    title: {
      text: '',
      offsetX: 30,
      style: {
        fontSize: '48px',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
  };
  sparklineData = [0, 47];
  wsUsagesChatOpts = {
    chart: {
      id: 'wsusagesparkline',
      group: 'sparklines',
      type: 'area',
      height: 140,
      sparkline: {
        enabled: true
      },
      fontFamily: 'Montserrat, Helvetica, sans-serif',
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 1,
    },
    series: [{
      name: 'Workspaces',
      data: []
    }],
    labels: [],
    yaxis: {
      min: 0
    },
    xaxis: {
      type: 'number',
    },
    colors: ['#008FFB'],
    markers: {
      size: 4,
    },
    title: {
      text: '',
      offsetX: 30,
      style: {
        fontSize: '48px',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
  };
  readonly DATA_MOD = Math.pow(1024, 3);

  public wsInfo: AnaWorkspace;
  public history: Date[];
  constructor(private anaSvc: AnaplanLoadService) {

  }
  ngOnInit() {
    this.anaSvc.getCurrentWS().then((res) => {
      this.wsInfo = res;
      const WSSize: number = this.convertOneToGega(this.wsInfo.currentWorkspaceSize);
      const WSTotal: number = this.convertOneToGega(this.wsInfo.workspaceSizeAllowance);

      this.wsUsagesChatOpts.title.text = '' + WSSize ;
      this.wsUsagesChat.updateOptions({
        title: this.wsUsagesChatOpts
      }, true, true);

      this.modelSizeChat.title.text = '' + this.convertOneToGega(this.wsInfo.model.modelsize);
      this.modelSizeChat.updateOptions({
        title: this.modelSizeChat.title
      }, true, true);

    });
    this.anaSvc.getSnaphistory().then((res) => {
      this.wsUsagesChatOpts.series = [{
        name: 'Workspace',
        data: []
      }];
      this.wsUsagesChatOpts.labels = [];
      this.modelSizeChatOpts.series = [{
        name: 'Model',
        data: []
      }];
      this.modelSizeChatOpts.labels = [];

      res.map((wsData, index) => {
        this.modelChartHistoryOpt.series[0].data.push({ x: new Date(wsData.time), y: [0, 0, 0, 0] });
        this.wsUsagesChatOpts.series[0].data.push(this.convertOneToGega(wsData.ws.size));
        this.wsUsagesChatOpts.labels.push(index + 1);
        this.modelSizeChatOpts.series[0].data.push(this.convertOneToGega(wsData.model.size));
        this.modelSizeChatOpts.labels.push(index + 1);
      });
      console.log('jts ngOnInit in Homepage');
      this.modelChartHistory.updateOptions({
        series: this.modelChartHistoryOpt.series,
      }, true, true);

      this.wsUsagesChat.updateOptions({
        series: this.wsUsagesChatOpts.series,
        labels: this.wsUsagesChatOpts.labels
      }, true, true);

      this.modelSizeChat.updateOptions({
        series: this.modelSizeChatOpts.series,
        labels: this.modelSizeChatOpts.labels
      }, true, true);
    });
  }
  private convertOneToGega(value: number) {
    return Number((value / this.DATA_MOD).toFixed(2));
  }
}
