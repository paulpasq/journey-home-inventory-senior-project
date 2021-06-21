import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services/index'
import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-twin-bed-chart',
  templateUrl: './twin-bed-chart.component.html',
  styleUrls: ['./twin-bed-chart.component.css']
})

/*
Chart that displays the number off twin beds in active inventory
it breaks them down into matresses, frames, and boxsprings
*/

export class TwinBedChartComponent implements OnInit {

  twinCategoryCounts: number[] = [];
  barChartLabels: Label[] = ['Twin Mattress', 'Twin Box Spring', 'Twin Frame'];
  barChartType: ChartType = 'bar';

  barChartData: ChartDataSets[] = [
    { data: this.twinCategoryCounts }
  ];
  barChartColors =
    [
      { // first color
        backgroundColor: 'rgba(0, 96, 254, 0.5)',
        borderColor: 'rgba(0, 96, 254, 0.5)',
        hoverBackgroundColor: 'rgba(0, 96, 254)',
        hoverBorderColor: 'rgba(0, 96, 254)'
      }
    ];
  barChartLegend: any
  twinMattressCount = 0;
  twinFrameCount = 0;
  twinBoxSpringCount = 0;
  twinBedCount = 0;
  maxCount = 0;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };


  constructor(private tableService: DataTableService) { }

  ngOnInit() {
    this.getCounts()
  }

  //Queries the database for all non-archived items
  getCounts() {
    this.tableService.getItems()
      .subscribe(items => {

        items.forEach(element => {
          if (!(element.Archived)) {
            //If the secondary category falls under any twin bedding items, add quantity to the corresponding count
            switch (element.SecondaryCategory) {
              case "Twin Mattress": {
                this.twinMattressCount = this.twinMattressCount + element.Quantity
                break;
              }
              case "Twin Box Spring": {
                this.twinBoxSpringCount = this.twinBoxSpringCount + element.Quantity
                break;
              }
              case "Twin Frame": {
                this.twinFrameCount = this.twinFrameCount + element.Quantity
                break;
              }
              default: {
                break;
              }

            }
          }

        })

        this.twinBedCount = this.min(this.twinMattressCount, this.twinBoxSpringCount)
        this.twinBedCount = this.min(this.twinBedCount, this.twinFrameCount)
        this.twinCategoryCounts.push(this.twinMattressCount)
        this.twinCategoryCounts.push(this.twinBoxSpringCount)
        this.twinCategoryCounts.push(this.twinFrameCount)
        this.maxCount = this.max(this.twinMattressCount, this.twinBoxSpringCount)
        this.maxCount = this.max(this.maxCount, this.twinFrameCount)



        //Then update the title and chart bars
        this.barChartOptions = {
          title: {
            text: ['Twin Bed Counts', this.twinBedCount + " Complete Twin Beds"],
            display: true,
            fontSize: 17
          },
          scales: {
            yAxes: [{
              ticks: {
                max: this.maxCount + (10 - (this.maxCount % 10)),
                min: 0
              }
            }]
          },
          legend: {
            display: false
          },

        };

      })


  }

  //Returns max between the two numbers
  max(num1: number, num2: number) {
    if (num1 >= num2) {
      return num1;
    }
    else if (num2 > num1) {
      return num2;
    }

  }

  //Returns min between the two numbers
  min(num1: number, num2: number) {
    if (num1 <= num2) {
      return num1;
    }
    else if (num2 < num1) {
      return num2;
    }

  }


  /*
  This plugin draws the red vericle line at the height given to it, currently set to the lowest ammount of items in the chart
  */
  public barChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    afterDraw: function (chart: any) {
      this.twinBedCount = chart.data.datasets[0].data[0]
      for (var i = 1; i < 3; i++) {

        if (chart.data.datasets[0].data[i] < this.twinBedCount) {
          this.twinBedCount = chart.data.datasets[0].data[i]
        }
      }
      var lineAt = this.twinBedCount;
      var ctxPlugin = chart.chart.ctx;
      var xAxe = chart.scales[chart.config.options.scales.xAxes[0].id];
      var yAxe = chart.scales[chart.config.options.scales.yAxes[0].id];

      if (yAxe.min != 0) return;

      ctxPlugin.strokeStyle = "red";
      ctxPlugin.beginPath();
      lineAt = (lineAt - yAxe.min) * (100 / yAxe.max);
      lineAt = (100 - lineAt) / 100 * (yAxe.height) + yAxe.top;
      ctxPlugin.moveTo(xAxe.left, lineAt);
      ctxPlugin.lineTo(xAxe.right, lineAt);
      ctxPlugin.stroke();
    }
  }];

}
