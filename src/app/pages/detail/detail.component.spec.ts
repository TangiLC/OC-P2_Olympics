import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DetailComponent } from './detail.component';
import { CountryService } from 'src/app/core/services/country.service';
import { CountryTotalData } from 'src/app/core/models/Olympic';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockCountryService: any;

  const mockCountryData: CountryTotalData = {
    name: 'Country A',
    totalParticipations: 5,
    totalMedalCount: [3, 2, 1],
    totalAthleteCount: 200,
  };

  const mockLineChartData = [
    {
      name: 'gold',
      series: [
        { name: '1988-Séoul', value: 5 },
        { name: '1992-Barcelone', value: 6 },
      ],
    },
    {
      name: 'silver',
      series: [
        { name: '1988-Séoul', value: 3 },
        { name: '1992-Barcelone', value: 4 },
      ],
    },
    {
      name: 'bronze',
      series: [
        { name: '1988-Séoul', value: 2 },
        { name: '1992-Barcelone', value: 3 },
      ],
    },
    {
      name: 'total',
      series: [
        { name: '1988-Séoul', value: 10 },
        { name: '1992-Barcelone', value: 13 },
      ],
    },
  ];

  beforeEach(async () => {
    mockCountryService = {
      setSelectedCountry: jasmine.createSpy('setSelectedCountry'),
      getCountryDataOrHandleError: jasmine
        .createSpy('getCountryDataOrHandleError')
        .and.returnValue(of(mockCountryData)),
      getLineChartDataOrHandleError: jasmine
        .createSpy('getLineChartDataOrHandleError')
        .and.returnValue(of(mockLineChartData)),
    };

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [
        { provide: CountryService, useValue: mockCountryService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'country' ? 'Country A' : null),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create detail page', () => {
    expect(component).toBeTruthy();
  });

  it('should call setSelectedCountry with the correct country name', () => {
    fixture.detectChanges();
    expect(mockCountryService.setSelectedCountry).toHaveBeenCalledWith(
      'Country A'
    );
  });

  it('should fetch country data on init', () => {
    component.countryData$.subscribe((data) => {
      expect(data).toEqual(mockCountryData);
    });
    expect(mockCountryService.getCountryDataOrHandleError).toHaveBeenCalled();
  });

  it('should fetch line chart data on init', () => {
    component.lineChartData$.subscribe((data) => {
      expect(data).toEqual(mockLineChartData);
    });
    expect(mockCountryService.getLineChartDataOrHandleError).toHaveBeenCalled();
  });

  it('should display country data in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.main-title')?.textContent).toContain(
      'Country A'
    );
    expect(compiled.querySelector('.frame-data')?.textContent).toContain('5');

    const goldMedalElement = compiled.querySelector('.gold');
    expect(goldMedalElement?.textContent).toContain('3');

    const totalMedals = mockCountryData.totalMedalCount.reduce(
      (sum: number, count: number) => sum + count,
      0
    );
    const totalMedalsElement = compiled.querySelector('.total');
    expect(totalMedalsElement?.textContent).toContain(totalMedals.toString());
  });
});
