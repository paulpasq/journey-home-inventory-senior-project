import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services/index'
import { Label } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';


@Component({
  selector: 'app-hold-time-chart',
  templateUrl: './hold-time-chart.component.html',
  styleUrls: ['./hold-time-chart.component.css']
})

/*
Chart that displays average amount of time an items spends in the warehouse based on category
*/

export class HoldTimeChartComponent implements OnInit {
  beginningYear: number = 2010;
  startYears: number[] = [];
  endYears: number[] = [];

  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  startMonths: number[] = [];
  endMonths: number[] = [];

  selectedStartMonth: number;
  selectedStartYear: number;
  selectedEndMonth: number;
  selectedEndYear: number;

  barChartLabels: Label[] = ['Kitchen', 'Bedroom', 'Living Room', 'Bathroom', 'Office'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Primary Category Averages',
      backgroundColor: ['rgb(187, 134, 247, 0.5)',
        'rgb(224, 137, 56, 0.5)',
        'rgb(70, 212, 67, 0.5)',
        'rgb(133, 209, 228, 0.5)',
        'rgb(238, 87, 67, 0.5)'],
      borderWidth: [2, 2, 2, 2, 2,]
    }
  ];


  barChartOptions: ChartOptions = {
    title: {
      text: ['Average Hold Times:',],
      display: true,
      fontSize: 17
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max: this.max(<number[]>this.barChartData[0].data) + (10 - ((this.max(<number[]>this.barChartData[0].data) % 10))),
        },
        scaleLabel: {
          labelString: "Days",
          display: true,
        }
      }]
    },
    legend: {
      display: false
    }
  };




  barChartColors = [
    {
      borderColor: [
        'rgb(187, 134, 247)',
        'rgb(224, 137, 56)',
        'rgb(70, 212, 67)',
        'rgb(133, 209, 228)',
        'rgb(238, 87, 67)'
      ]
    }
  ];

  kitchenItems: number[] = [];
  livingRoomItems: number[] = [];
  bedroomItems: number[] = [];
  bathroomItems: number[] = [];
  officeItems: number[] = [];

  constructor(private tableService: DataTableService) { }

  ngOnInit() {
    for (var i = new Date().getFullYear(); i >= this.beginningYear; i--) {
      this.startYears.push(i);
      this.endYears.push(i);
    }
    for (var i = 0; i <= new Date().getMonth(); i++) {
      this.endMonths.push(i);
    }
    for (var i = 0; i <= new Date().getMonth(); i++) {
      this.startMonths.push(i);
    }
    this.selectedStartMonth = this.startMonths[0];
    this.selectedStartYear = this.currentYear;
    this.selectedEndMonth = this.currentMonth;
    this.selectedEndYear = this.currentYear;
    this.updateTitle(this.selectedStartMonth, this.selectedStartYear, this.selectedEndMonth, this.selectedEndYear);

  }

  //Queries all items that have been donated
  populateChart() {
    this.kitchenItems = [];
    this.livingRoomItems = [];
    this.bedroomItems = [];
    this.bathroomItems = [];
    this.officeItems = [];
    this.tableService.getItems()
      .subscribe(items => {
        items.forEach(element => {
          if (element.Archived == true) {

            //Gets the starting and ending time frame
            var dateRecievedMinusOne = new Date(element.DateRecieved);
            var dateDonatedMinusOne = new Date(element.DateDonated);
            var dateRecieved = new Date(dateRecievedMinusOne.getFullYear(), dateRecievedMinusOne.getMonth(), (dateRecievedMinusOne.getDate() + 1));
            var dateDonated = new Date(dateDonatedMinusOne.getFullYear(), dateDonatedMinusOne.getMonth(), (dateDonatedMinusOne.getDate() + 1));

            //Checks to see if the item was recieved in that time frame
            if ((dateRecieved.getFullYear() > this.selectedStartYear/*1*/ && dateRecieved.getFullYear() < this.selectedEndYear/*2*/)/*3*/ || (dateRecieved.getMonth() >= this.selectedStartMonth/*4*/ && dateRecieved.getFullYear() == this.selectedStartYear/*5*/
              && dateRecieved.getFullYear() < this.selectedEndYear/*6*/)/*7*/ || (dateRecieved.getFullYear() >= this.selectedStartYear/*9*/
                && dateRecieved.getMonth() <= this.selectedEndMonth/*10*/ && dateRecieved.getFullYear() == this.selectedEndYear/*11*/)/*12*/)/*13*/ {

              //Calculates the ammount of days the item sat in the warehouse
              var daysBetween = (dateDonated.getTime() - dateRecieved.getTime()) / (1000 * 60 * 60 * 24);

              //Adds the item to the corresponding array based on its primary category
              switch (element.PrimaryCategory) {
                case "Kitchen": {
                  for (var i = 0; i <= element.Quantity; i++) {
                    this.kitchenItems.push(daysBetween);
                  }

                  break;
                }
                case "Bedroom": {
                  for (var i = 0; i <= element.Quantity; i++) {
                    this.bedroomItems.push(daysBetween);
                  }

                  break;
                }
                case "Living Room": {
                  for (var i = 0; i <= element.Quantity; i++) {
                    this.livingRoomItems.push(daysBetween);
                  }

                  break;
                }
                case "Bathroom": {
                  for (var i = 0; i <= element.Quantity; i++) {
                    this.bathroomItems.push(daysBetween);
                  }

                  break;
                }
                case "Office": {
                  for (var i = 0; i <= element.Quantity; i++) {
                    this.officeItems.push(daysBetween);
                  }

                  break;
                }
                default: {
                  break;
                }

              }

            }
          }
        })

        //Adds all the data into the corresponding primary categories variable
        var kitchenTotals = 0;
        for (var i = 0; i < this.kitchenItems.length; i++) {
          kitchenTotals = kitchenTotals + this.kitchenItems[i];
        }
        var officeTotals = 0;
        for (var i = 0; i < this.officeItems.length; i++) {
          officeTotals = officeTotals + this.officeItems[i];
        }
        var bedroomTotals = 0;
        for (var i = 0; i < this.bedroomItems.length; i++) {
          bedroomTotals = bedroomTotals + this.bedroomItems[i];
        }
        var livingRoomTotals = 0;
        for (var i = 0; i < this.livingRoomItems.length; i++) {
          livingRoomTotals = livingRoomTotals + this.livingRoomItems[i];
        }
        var bathroomTotals = 0;
        for (var i = 0; i < this.bathroomItems.length; i++) {
          bathroomTotals = bathroomTotals + this.bathroomItems[i];
        }

        //Calculates averages for each primary category
        var kitchenAverage = kitchenTotals / this.kitchenItems.length;
        var bathroomAverage = bathroomTotals / this.bathroomItems.length;
        var bedroomAverage = bedroomTotals / this.bedroomItems.length;
        var officeAverage = officeTotals / this.officeItems.length;
        var livingRoomAverage = livingRoomTotals / this.livingRoomItems.length;

        //Update the chart with the new information
        this.barChartData = [
          {
            data: [Number(kitchenAverage.toFixed(2)), Number(bedroomAverage.toFixed(2)), Number(livingRoomAverage.toFixed(2)), Number(bathroomAverage.toFixed(2)), Number(officeAverage.toFixed(2))], label: 'Primary Category Averages', backgroundColor: ['rgb(187, 134, 247, 0.5)',
              'rgb(224, 137, 56, 0.5)',
              'rgb(70, 212, 67, 0.5)',
              'rgb(133, 209, 228, 0.5)',
              'rgb(238, 87, 67, 0.5)'], borderWidth: [2, 2, 2, 2, 2,]
          }
        ];
        this.barChartOptions = {
          title: {
            text: ['Average Hold Times:', this.monthNames[this.selectedStartMonth] + " 1, " + this.selectedStartYear + " - " + this.monthNames[this.selectedEndMonth] + " " + this.getLastDay(this.selectedEndMonth, this.selectedEndYear) + " " + this.selectedEndYear],
            display: true,
            fontSize: 17
          },

          scales: {
            yAxes: [{
              ticks: {
                min: 0,
                max: this.max(<number[]>this.barChartData[0].data) + (10 - ((this.max(<number[]>this.barChartData[0].data) % 10))),
              },
              scaleLabel: {
                labelString: "Days",
                display: true,
              }
            }]
          },
          legend: {
            display: false
          }

        };
      })

  }


  //Finds the max of an array
  max(array: number[]) {
    var max = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }
    }
    return max;
  }




  //Updates the title to reflect date changes
  updateTitle(startMonth: number, startYear: number, endMonth: number, endYear: number) {
    this.populateChart();

    this.barChartOptions = {
      title: {
        text: ['Average Hold Times:', this.monthNames[startMonth] + " 1, " + startYear + " - " + this.monthNames[endMonth] + " " + this.getLastDay(endMonth, endYear) + " " + endYear],
        display: true,
        fontSize: 17
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: this.max(<number[]>this.barChartData[0].data) + (10 - ((this.max(<number[]>this.barChartData[0].data) % 10))),
          },
          scaleLabel: {
            labelString: "Days",
            display: true,
          }
        }]
      },
      legend: {
        display: false
      }
    };

  }


  //Finds the last day of the selected end month, or the current date if the selected end month is the current month
  getLastDay(month: number, year: number) {
    if (month == this.currentMonth && year == this.currentYear) {
      return new Date().getDate();
    }
    else {
      if ((year % 4) == 0) {
        if (month == 1) {
          return 29;
        }
        else if (month == 0 ||
          month == 2 ||
          month == 4 ||
          month == 6 ||
          month == 7 ||
          month == 9 ||
          month == 11) {
          return 31;
        }
        else {
          return 30;
        }
      }
      else {
        if (month == 1) {
          return 28;
        }
        else if (month == 0 ||
          month == 2 ||
          month == 4 ||
          month == 6 ||
          month == 7 ||
          month == 9 ||
          month == 11) {
          return 31;
        }
        else {
          return 30;
        }
      }
    }
  }



  /*
  This function handles any changes to the starting month. The least amount of error checking comes here because most of it is done in every other onChange event in the class
  *Note that the same month and year may be chosen on both dropdowns, this initiates month mode*
  */
  onChangeStartMonth($event) {
    this.selectedStartMonth = $event.target.value;
    this.updateTitle(this.selectedStartMonth, this.selectedStartYear, this.selectedEndMonth, this.selectedEndYear);
  }

  /*
  This function handles any changes to the ending month.
  *Note that the same month and year may be chosen on both dropdowns, this initiates month mode*
  */
  onChangeEndMonth($event) {
    this.selectedEndMonth = $event.target.value;
    if (this.selectedEndYear == this.selectedStartYear) {
      this.startMonths = [];
      if (this.selectedStartMonth > this.selectedEndMonth) {
        this.selectedStartMonth = 0;
      }
      for (var i = 0; i <= this.selectedEndMonth; i++) {
        this.startMonths.push(i);
      }
    }
    else {
      this.startMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    }
    this.updateTitle(this.selectedStartMonth, this.selectedStartYear, this.selectedEndMonth, this.selectedEndYear);
  }

  /*
  This function handles any changes to the starting year.
  *Note that the same month and year may be chosen on both dropdowns, this initiates month mode*
  */
  onChangeStartYear($event) {
    this.selectedStartYear = $event.target.value;
    if (this.selectedStartYear == this.selectedEndYear) {
      this.startMonths = [];
      for (var i = 0; i <= this.selectedEndMonth; i++) {
        this.startMonths.push(i);
      }
      if (this.selectedStartMonth > this.selectedEndMonth) {
        this.selectedStartMonth = 0;
      }
    }
    else {
      this.startMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    }
    this.updateTitle(this.selectedStartMonth, this.selectedStartYear, this.selectedEndMonth, this.selectedEndYear);
  }

  /*
  This function handles any changes to the ending year.
  This function has the most error checking as it prevents the starting date pickers from being later than the ending date pickers.
  It does this by removing the dates after the ending month and ending year from the starting dates dropdown menus.
  *Note that the same month and year may be chosen on both dropdowns, this initiates month mode*
  */
  onChangeEndYear($event) {
    this.selectedEndYear = $event.target.value;
    if (this.selectedEndYear < this.selectedStartYear) {
      if (this.selectedEndYear == this.currentYear) {
        this.endMonths = [];
        for (var i = 0; i <= this.currentMonth; i++) {
          this.endMonths.push(i);
        }
        if (this.selectedEndMonth > this.currentMonth) {
          this.selectedEndMonth = 0;
        }
        this.startYears = [];
        for (var i = this.selectedEndYear; i >= this.beginningYear; i--) {
          this.startYears.push(i);
        }
        this.selectedStartYear = this.currentYear;
        this.startMonths = [];
        for (var i = 0; i <= this.currentYear; i++) {
          this.startMonths.push(i);
        }
        if (this.selectedStartMonth > this.currentMonth) {
          this.selectedStartMonth = 0;
        }

      }
      else {
        this.endMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.startYears = [];
        for (var i = this.selectedEndYear; i >= this.beginningYear; i--) {
          this.startYears.push(i);
        }
        this.selectedStartYear = this.selectedEndYear;
        this.startMonths = [];
        for (var i = 0; i <= this.selectedEndMonth; i++) {
          this.startMonths.push(i);
        }
        if (this.selectedStartMonth > this.selectedEndMonth) {
          this.selectedStartMonth = 0;
        }
      }
    }
    else if (this.selectedEndYear == this.selectedStartYear) {
      if (this.selectedEndYear == this.currentYear) {
        this.endMonths = [];
        for (var i = 0; i <= this.currentMonth; i++) {
          this.endMonths.push(i);
        }
        if (this.selectedEndMonth > this.currentMonth) {
          this.selectedEndMonth = 0;
        }
        this.startYears = [];
        for (var i = this.selectedEndYear; i >= this.beginningYear; i--) {
          this.startYears.push(i);
        }
        this.selectedStartYear = this.currentYear;
        this.startMonths = [];
        for (var i = 0; i <= this.currentYear; i++) {
          this.startMonths.push(i);
        }
        if (this.selectedStartMonth > this.currentMonth) {
          this.selectedStartMonth = 0;
        }

      }
      else {
        this.endMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.startYears = [];
        for (var i = this.selectedEndYear; i >= this.beginningYear; i--) {
          this.startYears.push(i);
        }
        this.startMonths = [];
        for (var i = 0; i <= this.selectedEndMonth; i++) {
          this.startMonths.push(i);
        }
        if (this.selectedStartMonth > this.selectedEndMonth) {
          this.selectedStartMonth = 0;
        }
      }
    }
    else if (this.selectedEndYear > this.selectedStartYear) {
      if (this.selectedEndYear == this.currentYear) {
        this.endMonths = [];
        for (var i = 0; i <= this.currentMonth; i++) {
          this.endMonths.push(i);
        }
        if (this.selectedEndMonth > this.currentMonth) {
          this.selectedEndMonth = this.currentMonth;
        }
        this.startMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.startYears = [];
        for (var i = this.selectedEndYear; i >= this.beginningYear; i--) {
          this.startYears.push(i);
        }
      }
      else {
        this.endMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.startMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.startYears = [];
        for (var i = this.selectedEndYear; i >= this.beginningYear; i--) {
          this.startYears.push(i);
        }
      }
    }
    this.updateTitle(this.selectedStartMonth, this.selectedStartYear, this.selectedEndMonth, this.selectedEndYear);

  }

}
