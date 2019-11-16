import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { TableData } from '../../models/TableData';

@Component({
  selector: 'app-report-detail',
  templateUrl: 'report-detail.component.html'
})

export class ReportDetailComponent implements OnInit {


  public mostusedlist: TableData;

  lineItemSize = '53.7';

  public username = 'XXX';
  public modelID = 'XXX';
  public workspaceID = 'XXX';

  public chartModelFormatOpt = {
    chart: {
      height: 150,
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
        return val + '%';
      }
    },
    series: [{
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        enabled: true,
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
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: (val) => {
          return val;
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
  };

  @ViewChild('chartModelFormat', { static: true }) chartModelFormat: ChartComponent;


  ngOnInit() {
    this.mostusedlist = {
      showHeaderIdx: [1, 2, 3, 4],
      headerRow: ['ID', 'Name', 'Country', 'Salary', 'City'],
      dataRows: [
        ['1', 'Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738'],
        ['2', 'Minerva Hooper', 'Curaçao', 'Sinaai-Waas', '$23,789'],
        ['3', 'Sage Rodriguez', 'Netherlands', 'Baileux', '$56,142'],
        ['4', 'Philip Chaney', 'China', 'Overland Park', '$38,735'],
        ['5', 'Doris Greene', 'Malawi', 'Feldkirchen in Kärnten', '$63,542'],
        ['6', 'Mason Porter', 'Chile', 'Gloucester', '$78,615']
      ],
    };

  }
}
