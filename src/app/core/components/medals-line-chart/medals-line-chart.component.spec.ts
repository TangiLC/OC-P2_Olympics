import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MedalsLineChartComponent } from './medals-line-chart.component';

describe('MedalsLineChartComponent', () => {
  let component: MedalsLineChartComponent;
  let fixture: ComponentFixture<MedalsLineChartComponent>;

  const mockLineChartData = [
    {
      name: 'Gold',
      series: [
        { name: '1988', value: 5 },
        { name: '1992', value: 8 },
      ],
    },
    {
      name: 'Silver',
      series: [
        { name: '1988', value: 3 },
        { name: '1992', value: 7 },
      ],
    },
    {
      name: 'Bronze',
      series: [
        { name: '1988', value: 2 },
        { name: '1992', value: 4 },
      ],
    },
    {
      name: 'Total',
      series: [
        { name: '1988', value: 10 }, // 5 + 3 + 2
        { name: '1992', value: 19 }, // 8 + 7 + 4
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MedalsLineChartComponent,
        NgxChartsModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MedalsLineChartComponent);
    component = fixture.componentInstance;
    component.lineChartData = mockLineChartData;
    fixture.detectChanges();
  });

  it('should create line chart component', () => {
    //console.log('Component instance:', component);
    expect(component).toBeTruthy();
  });

  it('should calculate correct initial view dimensions', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1400,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800,
    });
    component.ngOnInit();
    fixture.detectChanges();
    const [width, height] = component.view;
    expect(width).toBe(0.75 * 1400);
    expect(height).toBe(0.5 * 800);
    expect(component.showYAxisLabel).toBeTrue();
  });

  it('should display correct line chart data', () => {
    expect(component.lineChartData).toEqual(mockLineChartData);

    const totalSeries = mockLineChartData.find((data) => data.name === 'Total');
    expect(totalSeries?.series).toContain({ name: '1988', value: 10 });
    expect(totalSeries?.series).toContain({ name: '1992', value: 19 });
  });

  it('should have correct chart properties', () => {
    expect(component.xAxisLabel).toBe('Year');
    expect(component.yAxisLabel).toBe('Medals');
    expect(component.colorScheme.domain).toEqual([
      '#ffb14e',
      '#ccccd4',
      '#b87333',
      '#04838f',
    ]);
    expect(component.animations).toBeTrue();
    expect(component.showLabels).toBeTrue();
  });
});
