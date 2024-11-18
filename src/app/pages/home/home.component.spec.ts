import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { OlympicsService } from 'src/app/core/services/olympics.service';
import { CountryTotalData } from 'src/app/core/models/Olympic';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockOlympicsService: any;

  const mockCountryTotalData: CountryTotalData[] = [
    {
      name: 'Country A',
      totalParticipations: 5,
      totalMedalCount: [3, 2, 1],
      totalAthleteCount: 200,
    },
    {
      name: 'Country B',
      totalParticipations: 8,
      totalMedalCount: [9, 8, 7],
      totalAthleteCount: 400,
    },
    {
      name: 'Country C',
      totalParticipations: 3,
      totalMedalCount: [1, 0, 2],
      totalAthleteCount: 100,
    },
  ];

  beforeEach(async () => {
    mockOlympicsService = {
      getOlympicStats: jasmine.createSpy('getOlympicStats').and.returnValue(
        of({
          countryData: mockCountryTotalData,
          maxTotalParticipations: 8,
        })
      ),
      getPieChartData: jasmine.createSpy('getPieChartData').and.returnValue(
        of([
          { name: 'Country A', value: 6 },
          { name: 'Country B', value: 24 },
          { name: 'Country C', value: 3 },
        ])
      ),
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: OlympicsService, useValue: mockOlympicsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create home page', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch olympic stats on init', () => {
    component.olympicStats$.subscribe((data) => {
      expect(data).toEqual({
        countryData: mockCountryTotalData,
        maxTotalParticipations: 8,
      });
    });
    expect(mockOlympicsService.getOlympicStats).toHaveBeenCalled();
  });

  it('should fetch pie chart data on init', () => {
    component.pieChartData$.subscribe((data) => {
      expect(data).toEqual([
        { name: 'Country A', value: 6 },
        { name: 'Country B', value: 24 },
        { name: 'Country C', value: 3 },
      ]);
    });
    expect(mockOlympicsService.getPieChartData).toHaveBeenCalled();
  });

  it('should display olympic stats in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.frame-data')?.textContent).toContain('8');
    const countryCountElement = compiled.querySelectorAll('.frame-data')[1];
    expect(countryCountElement?.textContent).toContain('3');
  });

  it('should display pie chart data correctly', () => {
    component.pieChartData$.subscribe((data) => {
      const totalMedals = data.reduce((sum, item) => sum + item.value, 0);
      expect(totalMedals).toBe(33);
    });
  });
});
