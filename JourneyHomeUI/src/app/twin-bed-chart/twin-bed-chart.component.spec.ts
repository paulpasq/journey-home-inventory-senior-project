import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwinBedChartComponent } from './twin-bed-chart.component';

describe('TwinBedChartComponent', () => {
  let component: TwinBedChartComponent;
  let fixture: ComponentFixture<TwinBedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwinBedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwinBedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
