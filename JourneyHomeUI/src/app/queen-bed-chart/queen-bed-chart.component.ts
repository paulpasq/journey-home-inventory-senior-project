import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services/index'
import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-queen-bed-chart',
  templateUrl: './queen-bed-chart.component.html',
  styleUrls: ['./queen-bed-chart.component.css']
})

/*
Chart that displays the number off queen beds in active inventory
it breaks them down into matresses, frames, and boxsprings
*/

export class QueenBedChartComponent implements OnInit {

  queenCategoryCounts: number[] = [];
  barChartLabels: Label[] = ['Queen Mattress', 'Queen Box Spring', 'Queen Frame'];
  barChartType: ChartType = 'bar';
  barChartLegend: any
  barChartData: ChartDataSets[] = [{ data: this.queenCategoryCounts }];
  barChartColors =
    [
      { // first color
        backgroundColor: 'rgba(239, 147, 55, 0.5)',
        borderColor: 'rgba(239, 147, 55, 0.5)',
        hoverBackgroundColor: 'rgba(239, 147, 55)',
        hoverBorderColor: 'rgba(239, 147, 55)'
      }
    ];

  queenMattressCount = 0;
  queenFrameCount = 0;
  queenBoxSpringCount = 0;
  queenBedCount = 0;
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
            //If the secondary category falls under any queen bedding items, add quantity to the corresponding count
            switch (element.SecondaryCategory) {
              case "Queen Mattress": {
                this.queenMattressCount = this.queenMattressCount + element.Quantity
                break;
              }
              case "Queen Box Spring": {
                this.queenBoxSpringCount = this.queenBoxSpringCount + element.Quantity
                break;
              }
              case "Queen Frame": {
                this.queenFrameCount = this.queenFrameCount + element.Quantity
                break;
              }
              default: {
                break;
              }

            }
          }

        })
        this.queenBedCount = this.min(this.queenMattressCount, this.queenBoxSpringCount)
        this.queenBedCount = this.min(this.queenBedCount, this.queenFrameCount)
        this.queenCategoryCounts.push(this.queenMattressCount)
        this.queenCategoryCounts.push(this.queenBoxSpringCount)
        this.queenCategoryCounts.push(this.queenFrameCount)
        this.maxCount = this.max(this.queenMattressCount, this.queenBoxSpringCount)
        this.maxCount = this.max(this.maxCount, this.queenFrameCount)



        //Then update the title and chart bars
        this.barChartOptions = {
          title: {
            text: ['Queen Bed Counts', this.queenBedCount + " Complete Queen Beds"],
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
      this.queenBedCount = chart.data.datasets[0].data[0]
      for (var i = 1; i < 3; i++) {
        if (chart.data.datasets[0].data[i] < this.queenBedCount) {
          this.queenBedCount = chart.data.datasets[0].data[i]
        }
      }
      var lineAt = this.queenBedCount;
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
