import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCountsChartComponent } from './total-counts-chart.component';

describe('TotalCountsChartComponent', () => {
  let component: TotalCountsChartComponent;
  let fixture: ComponentFixture<TotalCountsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalCountsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCountsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
