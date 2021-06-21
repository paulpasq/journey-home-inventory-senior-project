import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services/index'
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-total-counts-chart',
  templateUrl: './total-counts-chart.component.html',
  styleUrls: ['./total-counts-chart.component.css']
})

/*
This page handles the inventory counts chart
This cahrt shows the number and percentages of the current inventory based on category
*/

export class TotalCountsChartComponent implements OnInit {

  PrimaryCategoryCounts: number[] = [];

  KitchenCounts = 0;
  BathroomCounts = 0;
  OfficeCounts = 0;
  BedroomCounts = 0;
  LivingRoomCounts = 0;
  TotalCounts = 0;

  s: string = ""
  doughnutChartLabels: Label[] = ['Kitchen', 'Bedroom', 'Living Room', 'Bathroom', 'Office'];
  doughnutChartData: MultiDataSet = [
    this.PrimaryCategoryCounts
  ];

  doughnutChartType: ChartType = 'doughnut';

  doughnutChartColors = [
    {
      backgroundColor: [
        'rgb(187, 134, 247)',
        'rgb(224, 137, 56)',
        'rgb(70, 212, 67)',
        'rgb(133, 209, 228)',
        'rgb(238, 87, 67)'
      ]
    }
  ];
  doughnutChartOptions = {
  };

  public doughnutChartPlugins = [pluginDataLabels];

  constructor(private tableService: DataTableService) {

  }

  ngOnInit() {
    this.getCounts()

  }

  //Query all items not archived
  getCounts() {
    this.tableService.getItems()
      .subscribe(items => {

        items.forEach(element => {
          //Based on the items primary category, add its quantity to the corresponding counts variables
          if (!(element.Archived)) {
            switch (element.PrimaryCategory) {
              case "Kitchen": {
                this.KitchenCounts = this.KitchenCounts + element.Quantity
                this.TotalCounts = this.TotalCounts + element.Quantity
                break;
              }
              case "Bedroom": {
                this.BedroomCounts = this.BedroomCounts + element.Quantity
                this.TotalCounts = this.TotalCounts + element.Quantity
                break;
              }
              case "Living Room": {
                this.LivingRoomCounts = this.LivingRoomCounts + element.Quantity
                this.TotalCounts = this.TotalCounts + element.Quantity
                break;
              }
              case "Bathroom": {
                this.BathroomCounts = this.BathroomCounts + element.Quantity
                this.TotalCounts = this.TotalCounts + element.Quantity
                break;
              }
              case "Office": {
                this.OfficeCounts = this.OfficeCounts + element.Quantity
                this.TotalCounts = this.TotalCounts + element.Quantity
                break;
              }
              default: {
                break;
              }

            }
          }

        })

        this.PrimaryCategoryCounts.push(this.KitchenCounts)
        this.PrimaryCategoryCounts.push(this.BedroomCounts)
        this.PrimaryCategoryCounts.push(this.LivingRoomCounts)
        this.PrimaryCategoryCounts.push(this.BathroomCounts)
        this.PrimaryCategoryCounts.push(this.OfficeCounts)
        this.s = this.TotalCounts.toString();

        //Update the charts title and data to the newly updated data
        this.doughnutChartOptions = {
          title: {
            text: [['Total Inventory Breakdown: '], [this.TotalCounts + " Items Currently in Inventory"]],
            display: true,
            fontSize: 17
          },
          tooltips: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem, data) {
                let label = data.labels[tooltipItem.index];
                let count: any = data
                  .datasets[tooltipItem.datasetIndex]
                  .data[tooltipItem.index];
                return label + ": " + new Intl.NumberFormat('pt-BR').format(count);
              },
            },
          },
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr: any[] = ctx.chart.data.datasets[0].data;
                dataArr.map((data: number) => {
                  sum += data;
                });
                let percentage = (value * 100 / sum).toFixed(2) + "%";
                if (Number((value * 100 / sum).toFixed(2)) != 0) {
                  return percentage;
                }
                else {
                  return "";
                }

              },
              color: 'black',
              display: true
            }
          }
        };

      })

  }

  //This function handles the percentage toggle checkbox and toggles the percentages on the doughnut chart
  percentageToggle(e) {
    if (e.target.checked) {
      this.doughnutChartOptions = {
        title: {
          text: [['Total Inventory Breakdown: '], [this.TotalCounts + " Items Currently in Inventory"]],
          display: true,
          fontSize: 17
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.labels[tooltipItem.index];
              let count: any = data
                .datasets[tooltipItem.datasetIndex]
                .data[tooltipItem.index];
              return label + ": " + new Intl.NumberFormat('pt-BR').format(count);
            },
          },
        },
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr: any[] = ctx.chart.data.datasets[0].data;
              dataArr.map((data: number) => {
                sum += data;
              });
              let percentage = (value * 100 / sum).toFixed(2) + "%";
              return percentage;
            },
            color: 'black',
            display: true
          }
        }
      };
    }
    else if (!(e.target.checked)) {
      this.doughnutChartOptions = {
        title: {
          text: [['Total Inventory Breakdown: '], [this.TotalCounts + " Items Currently in Inventory"]],
          display: true,
          fontSize: 17
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.labels[tooltipItem.index];
              let count: any = data
                .datasets[tooltipItem.datasetIndex]
                .data[tooltipItem.index];
              return label + ": " + new Intl.NumberFormat('pt-BR').format(count);
            },
          },
        },
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr: any[] = ctx.chart.data.datasets[0].data;
              dataArr.map((data: number) => {
                sum += data;
              });
              let percentage = (value * 100 / sum).toFixed(2) + "%";
              return percentage;
            },
            color: 'black',
            display: false
          }
        }
      };
    }
  }
}
