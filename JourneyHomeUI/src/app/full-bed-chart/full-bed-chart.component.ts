import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services/index'
import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-full-bed-chart',
  templateUrl: './full-bed-chart.component.html',
  styleUrls: ['./full-bed-chart.component.css']
})

/*
Chart that displays the number off full beds in active inventory
it breaks them down into matresses, frames, and boxsprings
*/
export class FullBedChartComponent implements OnInit {

  fullCategoryCounts: number[] = [];
  barChartLabels: Label[] = ['Full Mattress', 'Full Box Spring', 'Full Frame'];
  barChartType: ChartType = 'bar';

  barChartData: ChartDataSets[] = [{ data: this.fullCategoryCounts }];
  barChartLegend: any
  fullMattressCount = 0;
  fullFrameCount = 0;
  fullBoxSpringCount = 0;
  fullBedCount = 0;
  maxCount = 0;

  barChartColors =
    [
      { // first color
        backgroundColor: 'rgba(67, 204, 27, 0.5)',
        borderColor: 'rgba(67, 204, 27, 0.5)',
        hoverBackgroundColor: 'rgba(67, 204, 27)',
        hoverBorderColor: 'rgba(67, 204, 27)'
      }
    ];

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
            //If the secondary category falls under any full bedding items, add quantity to the corresponding count
            switch (element.SecondaryCategory) {
              case "Full Mattress": {
                this.fullMattressCount = this.fullMattressCount + element.Quantity
                break;
              }
              case "Full Box Spring": {
                this.fullBoxSpringCount = this.fullBoxSpringCount + element.Quantity
                break;
              }
              case "Full Frame": {
                this.fullFrameCount = this.fullFrameCount + element.Quantity
                break;
              }
              default: {
                break;
              }
            }
          }

        })
        this.fullBedCount = this.min(this.fullMattressCount, this.fullBoxSpringCount)
        this.fullBedCount = this.min(this.fullBedCount, this.fullFrameCount)
        this.fullCategoryCounts.push(this.fullMattressCount)
        this.fullCategoryCounts.push(this.fullBoxSpringCount)
        this.fullCategoryCounts.push(this.fullFrameCount)
        this.maxCount = this.max(this.fullMattressCount, this.fullBoxSpringCount)
        this.maxCount = this.max(this.maxCount, this.fullFrameCount)


        //Then update the title and chart bars
        this.barChartOptions = {
          title: {
            text: ['Full Bed Counts', this.fullBedCount + " Complete Full Beds"],
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
      this.fullBedCount = chart.data.datasets[0].data[0]
      for (var i = 1; i < 3; i++) {

        if (chart.data.datasets[0].data[i] < this.fullBedCount) {
          this.fullBedCount = chart.data.datasets[0].data[i]
        }
      }
      var lineAt = this.fullBedCount;
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
