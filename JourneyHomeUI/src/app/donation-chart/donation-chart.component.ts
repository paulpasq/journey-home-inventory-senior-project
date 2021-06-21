import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services/index'
import { Label, Color } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-donation-chart',
  templateUrl: './donation-chart.component.html',
  styleUrls: ['./donation-chart.component.css']
})

/*
Donation history chart
calculates and displays the number of donation dropoffs vs number of items durring the selected time period.
*/

export class DonationChartComponent implements OnInit {

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

  itemsArray: number[] = [];
  donationsArray: number[] = [];

  lineChartData: ChartDataSets[] = [
    { data: this.itemsArray, label: '# of Items', lineTension: 0 },
    { data: this.donationsArray, label: 'Donations', lineTension: 0 },
  ];
  lineChartDataSize: number;
  lineChartLabels: Label[] = ['Month1', 'Month2', 'Month3', 'Month4', 'Month5', 'Month6', 'Month7', 'Month8', 'Month9', 'Month10', 'Month11', 'Month12',];
  lineChartOptions: (ChartOptions) = {
    title: {
      text: [],
      display: true,
      fontSize: 17
    },
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          min: 0
        }
      }]
    },
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'rgba(220, 93, 42, 1)',
      backgroundColor: 'rgba(220, 93, 42, 0.2)',
    },
    {
      borderColor: 'rgba(76, 147, 255, 1)',
      backgroundColor: 'rgba(76, 147, 255, 0.6)',
    },
  ];

  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [];
  isOneMonth: boolean = false;









  constructor(private tableService: DataTableService) {
  }

  /*
  On initialization the current month and year are obtained, the label is updated, and then the chart is populated
  */
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
    this.lineChartOptions.title.text = ['Donation History:', this.monthNames[this.selectedStartMonth] + ", " + this.selectedStartYear + " - " + this.monthNames[this.selectedEndMonth] + ", " + this.selectedEndYear];
    this.lineChartDataSize = ((this.selectedEndYear - this.selectedStartYear) * 12) + (this.selectedEndMonth - this.selectedStartMonth) + 1;
    this.populateChart();
  }




  /*
  This function performs many tasks. First it checks if the chart needs to go into month mode, meaning the start and end dates are the same month and year, or year mode,
  meaning the start and end dates are different. It also edits the line chart labels and populates the data if the item was recieved in the alloted time frame.
  If the item was recieved in the proper time frame then its position in the array needs to be determined. It cannot just be pushed to the array because this is a
  time dependent chart meaning if an array position has 0 in it, then that 0 means something and needs to be there. It also needs to determine if the array is
  for the month mode or year mode and put the items in the corresponding spot. Obviously those calculations are different depending on when the item was recieved.
  i.e. the item needs to be placed in the corresponding month position for year mode, or the corresponding day position for month mode. The size and positions of each item
  may change in the array if the start and end dates are changed which is why this function may be called on the update of those dates.
  */
  populateChart() {
    this.lineChartLabels = [];
    if (this.selectedStartYear != this.selectedEndYear) {
      for (var i = this.selectedStartMonth; i <= 11; i++) {
        if (i == this.selectedStartMonth || i == 11) {
          this.lineChartLabels.push(this.monthNames[i] + " " + this.selectedStartYear);
        }
        else {
          this.lineChartLabels.push(this.monthNames[i]);
        }
      }

      var tempStartYear = this.selectedStartYear;
      tempStartYear++;

      for (var i = tempStartYear; i < this.selectedEndYear; i++) {
        for (var m = 0; m <= 11; m++) {
          if (m == 0 || m == 11) {
            this.lineChartLabels.push(this.monthNames[m] + " " + i);
          }
          else {
            this.lineChartLabels.push(this.monthNames[m]);
          }
        }
      }

      for (var i = 0; i <= this.selectedEndMonth; i++) {
        if (i == 0 || i == this.selectedEndMonth) {
          this.lineChartLabels.push(this.monthNames[i] + " " + this.selectedEndYear);
        }
        else {
          this.lineChartLabels.push(this.monthNames[i]);
        }
      }
    }
    else {
      for (var i = this.selectedStartMonth; i <= this.selectedEndMonth; i++) {
        if (this.selectedStartMonth != this.selectedEndMonth) {
          if (i == this.selectedStartMonth || i == this.selectedEndMonth) {
            this.lineChartLabels.push(this.monthNames[i] + " " + this.selectedEndYear);
          }
          else {
            this.lineChartLabels.push(this.monthNames[i]);
          }
        }
        else {
          for (var i = 1; i <= this.lineChartDataSize; i++) {
            if (i == 1 || i == this.lineChartDataSize) {
              this.lineChartLabels.push(this.monthNames[this.selectedEndMonth] + " " + i + ", " + this.selectedEndYear);
            }
            else {
              this.lineChartLabels.push(this.monthNames[this.selectedEndMonth] + " " + i);
            }
          }
        }
      }
    }

    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.itemsArray = [];
    this.donationsArray = [];

    for (var i = 0; i < this.lineChartDataSize; i++) {
      this.itemsArray.push(0);
      this.donationsArray.push(0);
    }
    this.tableService.getItems()
      .subscribe(items => {
        items.forEach(element => {
          var elementDate = new Date(Number(element.DateRecieved.slice(0, 4)), (Number(element.DateRecieved.slice(5, 7))) - 1, (Number((element.DateRecieved.slice(element.DateRecieved.length - 2, element.DateRecieved.length)))));

          if ((((elementDate.getFullYear() > this.selectedStartYear/*1*/ && elementDate.getFullYear() < this.selectedEndYear/*2*/)/*3*/ || (elementDate.getMonth() >= this.selectedStartMonth/*4*/ && elementDate.getFullYear() == this.selectedStartYear/*5*/
            && elementDate.getFullYear() < this.selectedEndYear/*6*/)/*7*/ || (elementDate.getFullYear() >= this.selectedStartYear/*9*/
              && elementDate.getMonth() <= this.selectedEndMonth/*10*/ && elementDate.getFullYear() == this.selectedEndYear/*11*/)/*12*/) && (!this.isOneMonth)) || ((elementDate.getMonth() == this.selectedStartMonth) && (elementDate.getFullYear() == this.selectedStartYear) && (elementDate.getMonth() == this.selectedEndMonth) && (elementDate.getFullYear() == this.selectedEndYear) && (this.isOneMonth))) {
            if (this.isOneMonth) {
              this.itemsArray[elementDate.getDate() - 1] = this.itemsArray[elementDate.getDate() - 1] + element.Quantity;
              this.donationsArray[elementDate.getDate() - 1] = this.donationsArray[elementDate.getDate() - 1] + 1;
            }
            else {
              this.itemsArray[((elementDate.getMonth() - this.selectedStartMonth) + ((elementDate.getFullYear() - this.selectedStartYear) * 12))] = this.itemsArray[((elementDate.getMonth() - this.selectedStartMonth) + ((elementDate.getFullYear() - this.selectedStartYear) * 12))] + element.Quantity;
              this.donationsArray[((elementDate.getMonth() - this.selectedStartMonth) + ((elementDate.getFullYear() - this.selectedStartYear) * 12))] = this.donationsArray[((elementDate.getMonth() - this.selectedStartMonth) + ((elementDate.getFullYear() - this.selectedStartYear) * 12))] + 1;
            }
          }
        })

        for (var i = 0; i < this.lineChartDataSize; i++) {
          this.lineChartData[0].data[i] = this.itemsArray[i];
          this.lineChartData[1].data[i] = this.donationsArray[i];
        }
      })
  }


  /*
  This function checks to see if the start and end dates are the same. If they are then the month mode is activated, if not then the year mode is activated.
  */
  checkDateRangeSize() {
    this.isOneMonth = false;
    if (this.lineChartDataSize == 1) {
      this.isOneMonth = true;
      this.lineChartOptions = {
        title: {
          text: ['Donation History:', this.monthNames[this.selectedStartMonth] + ", " + this.selectedStartYear],
          display: true,
          fontSize: 17
        },
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        },
      };

      if (this.selectedEndYear == this.selectedStartYear) {
        if (this.selectedEndMonth == this.selectedStartMonth) {
          if (this.selectedEndMonth == 0 ||
            this.selectedEndMonth == 2 ||
            this.selectedEndMonth == 4 ||
            this.selectedEndMonth == 6 ||
            this.selectedEndMonth == 7 ||
            this.selectedEndMonth == 9 ||
            this.selectedEndMonth == 11) {
            this.lineChartDataSize = 31;
          }
          else if (this.selectedEndMonth == 1) {
            if ((this.selectedEndYear % 4) == 0) {
              this.lineChartDataSize = 29;
            }
            else {
              this.lineChartDataSize = 28;
            }
          }
          else {
            this.lineChartDataSize = 30;
          }
        }
      }
    }
    else {
      this.lineChartOptions = {
        title: {
          text: ['Donation History:', this.monthNames[this.selectedStartMonth] + ", " + this.selectedStartYear + " - " + this.monthNames[this.selectedEndMonth] + ", " + this.selectedEndYear],
          display: true,
          fontSize: 17
        },
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        },
      };
    }
  }





  /*
  This function handles any changes to the starting month. The least amount of error checking comes here because most of it is done in every other onChange event in the class
  *Note that the same month and year may be chosen on both dropdowns, this initiates month mode*
  */
  onChangeStartMonth($event) {
    this.selectedStartMonth = $event.target.value;
    this.lineChartDataSize = ((this.selectedEndYear - this.selectedStartYear) * 12) + (this.selectedEndMonth - this.selectedStartMonth) + 1;
    this.checkDateRangeSize();
    this.populateChart();

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

    this.lineChartDataSize = ((this.selectedEndYear - this.selectedStartYear) * 12) + (this.selectedEndMonth - this.selectedStartMonth) + 1;
    this.checkDateRangeSize();
    this.populateChart();

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

    this.lineChartDataSize = ((this.selectedEndYear - this.selectedStartYear) * 12) + (this.selectedEndMonth - this.selectedStartMonth) + 1;
    this.checkDateRangeSize();
    this.populateChart();
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

    this.lineChartDataSize = ((this.selectedEndYear - this.selectedStartYear) * 12) + (this.selectedEndMonth - this.selectedStartMonth) + 1;
    this.checkDateRangeSize();
    this.populateChart();

  }

}
