import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullBedChartComponent } from './full-bed-chart.component';

describe('FullBedChartComponent', () => {
  let component: FullBedChartComponent;
  let fixture: ComponentFixture<FullBedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullBedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullBedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
