import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsLineChartComponent } from './medals-line-chart.component';

describe('MedalsLineChartComponent', () => {
  let component: MedalsLineChartComponent;
  let fixture: ComponentFixture<MedalsLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalsLineChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedalsLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
