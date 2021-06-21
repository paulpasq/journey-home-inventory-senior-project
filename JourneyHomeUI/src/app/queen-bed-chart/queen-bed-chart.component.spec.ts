import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueenBedChartComponent } from './queen-bed-chart.component';

describe('QueenBedChartComponent', () => {
  let component: QueenBedChartComponent;
  let fixture: ComponentFixture<QueenBedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueenBedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueenBedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
