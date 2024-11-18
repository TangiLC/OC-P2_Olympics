import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MedalsPieChartComponent } from './medals-pie-chart.component';
import { CountryService } from '../../services/country.service';

describe('MedalsPieChartComponent', () => {
  let component: MedalsPieChartComponent;
  let fixture: ComponentFixture<MedalsPieChartComponent>;
  let mockCountryService: any;
  let mockRouter: any;

  const mockPieChartData = [
    { name: 'Country A', value: 5 },
    { name: 'Country B', value: 10 },
    { name: 'Country C', value: 15 },
  ];

  beforeEach(async () => {
    mockCountryService = {
      setSelectedCountry: jasmine.createSpy('setSelectedCountry'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [MedalsPieChartComponent],
      providers: [
        { provide: CountryService, useValue: mockCountryService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MedalsPieChartComponent);
    component = fixture.componentInstance;
    component.pieChartData = mockPieChartData;
    fixture.detectChanges();
  });

  it('should create pie chart component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate correct initial view dimensions', () => {
    const [width, height] = component.view;

    expect(width).toBeLessThanOrEqual(1260);
    expect(height).toBeLessThanOrEqual(600);
    expect(component.labels).toBeTrue();
  });

  it('should call setSelectedCountry and navigate on select', () => {
    const event = { name: 'Country A' };
    component.onSelect(event);

    expect(mockCountryService.setSelectedCountry).toHaveBeenCalledWith(
      'Country A'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/detail', 'Country A']);
  });

  it('should call setSelectedCountry on activate', () => {
    const event = { entries: [{ name: 'Country B' }] };
    component.onActivate(event);

    expect(mockCountryService.setSelectedCountry).toHaveBeenCalledWith(
      'Country B'
    );
  });

  it('should reset selected country on deactivate', () => {
    const event = { entries: [{ name: 'Country C' }] };
    component.onDeactivate(event);

    expect(mockCountryService.setSelectedCountry).toHaveBeenCalledWith('');
  });

  it('should return expected tooltip text', () => {
    const event = { data: { label: 'Country A', value: 5 } };
    const tooltip = component.setTooltipText(event);

    expect(tooltip).toBe('Country A<br>🏅5');
  });
});
