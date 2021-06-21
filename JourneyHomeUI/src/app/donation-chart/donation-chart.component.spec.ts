import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationChartComponent } from './donation-chart.component';

describe('DonationChartComponent', () => {
  let component: DonationChartComponent;
  let fixture: ComponentFixture<DonationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
