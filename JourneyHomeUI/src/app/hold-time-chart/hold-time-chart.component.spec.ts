import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldTimeChartComponent } from './hold-time-chart.component';

describe('HoldTimeChartComponent', () => {
  let component: HoldTimeChartComponent;
  let fixture: ComponentFixture<HoldTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
