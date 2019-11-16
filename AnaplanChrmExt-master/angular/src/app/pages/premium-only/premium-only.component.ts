import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { AnaplanLoadService } from 'src/app/services/anaplanload.service';
import { AnaWorkspace, AnaModel } from 'src/app/models/anaplanmodel';
import { map } from 'rxjs/operators';
import { width } from '@amcharts/amcharts4/.internal/core/utils/Utils';

@Component({
  selector: 'app-premium-only',
  templateUrl: 'premium-only.component.html',
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
    `
  ]
})

export class PremiumOnlyComponent implements OnInit {

  @ViewChild('wsChartSize', { static: true }) wsChartSize: ChartComponent;
  @ViewChild('modelChartSize', { static: true }) modelChartSize: ChartComponent;
  @ViewChild('modelChartHistory', { static: true }) modelChartHistory: ChartComponent;
  @ViewChild('modelChartQuantity', { static: true }) modelChartQuantity: ChartComponent;

  readonly routerLink = {
    workspacesize: '/workspacesize',
    modelsize: '/modelsize',
    auditreport: '/auditreport',
    optimization: '/optimization',
  };
  wsChartSizeSetting = {
    chart: {
      type: 'pie',
      height: 235
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
      height: 235
    },
    series: [],
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
      height: '140',
      width: '90%',
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
    },
    series: [{ data: [] }],
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

  // modelChartQuantitySetting = {
  //   chart: {
  //     type: 'radialBar',
  //     height: 300
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       track: {
  //         background: '#e7e7e7',
  //         strokeWidth: '97%',
  //         margin: 5,
  //         shadow: {
  //           enabled: true,
  //           top: 2,
  //           left: 0,
  //           color: '#999',
  //           opacity: 1,
  //           blur: 2
  //         }
  //       },
  //       dataLabels: {
  //         name: {
  //           show: false
  //         },
  //         value: {
  //           offsetY: 15,
  //           fontSize: '22px'
  //         }
  //       }
  //     }
  //   },
  //   labels: ['Average Results'],
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       shade: 'light',
  //       shadeIntensity: 0.4,
  //       inverseColors: false,
  //       opacityFrom: 1,
  //       opacityTo: 1,
  //       stops: [0, 50, 53, 91]
  //     }
  //   },
  //   series: [0]
  // };

  readonly DATA_MOD = Math.pow(1024, 3);

  public wsInfo: AnaWorkspace;
  public history: Date[];
  constructor(private anaSvc: AnaplanLoadService) {

  }
  ngOnInit() {
  }
}
