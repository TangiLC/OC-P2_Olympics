import { TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { CountryService } from './country.service';
import { OlympicsService } from './olympics.service';
import { ErrorService } from './error.service';
import { CountryDetail, CountryTotalData } from '../models/Olympic';

describe('CountryService', () => {
  let service: CountryService;
  let mockOlympicsService: any;
  let mockErrorService: any;

  const mockCountryData: CountryTotalData[] = [
    {
      name: 'Country A',
      totalParticipations: 5,
      totalMedalCount: [10, 5, 3],
      totalAthleteCount: 200,
    },
    {
      name: 'Country B',
      totalParticipations: 8,
      totalMedalCount: [20, 15, 10],
      totalAthleteCount: 400,
    },
  ];

  const mockOlympicsCountries: CountryDetail[] = [
    {
      id: 1,
      country: 'Country A',
      participations: [
        {
          id: 1,
          year: 1988,
          city: 'Seoul',
          medalsCount: [3, 2, 1],
          athleteCount: 100,
        },
        {
          id: 2,
          year: 1992,
          city: 'Barcelona',
          medalsCount: [7, 3, 2],
          athleteCount: 100,
        },
      ],
    },
    {
      id: 2,
      country: 'Country B',
      participations: [
        {
          id: 3,
          year: 1988,
          city: 'Seoul',
          medalsCount: [10, 5, 3],
          athleteCount: 200,
        },
        {
          id: 4,
          year: 1992,
          city: 'Barcelona',
          medalsCount: [10, 10, 5],
          athleteCount: 200,
        },
      ],
    },
  ];

  beforeEach(() => {
    mockOlympicsService = {
      loadInitialData: jasmine
        .createSpy('loadInitialData')
        .and.returnValue(of(true)),
      getOlympicStats: jasmine
        .createSpy('getOlympicStats')
        .and.returnValue(of({ countryData: mockCountryData })),
      getOlympics: jasmine
        .createSpy('getOlympics')
        .and.returnValue(of(mockOlympicsCountries)),
    };

    mockErrorService = {
      setErrorAndNavigate: jasmine.createSpy('setErrorAndNavigate'),
    };

    TestBed.configureTestingModule({
      providers: [
        CountryService,
        { provide: OlympicsService, useValue: mockOlympicsService },
        { provide: ErrorService, useValue: mockErrorService },
      ],
    });

    service = TestBed.inject(CountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set selected country', () => {
    service.setSelectedCountry('Country A');
    service.selectedCountry$.subscribe((country) => {
      expect(country).toBe('Country A');
    });
  });

  it('should return country data by name', (done) => {
    service.getCountryDataByName('Country A').subscribe((data) => {
      expect(data).toEqual(mockCountryData[0]);
      done();
    });
    expect(mockOlympicsService.loadInitialData).toHaveBeenCalled();
    expect(mockOlympicsService.getOlympicStats).toHaveBeenCalled();
  });

  it('should handle error when country data is not found', (done) => {
    const countryName$ = new BehaviorSubject<string | null>(
      'Nonexistent Country'
    );
    service.getCountryDataOrHandleError(countryName$).subscribe((data) => {
      expect(data).toBeUndefined();
      expect(mockErrorService.setErrorAndNavigate).toHaveBeenCalledWith(
        'Pas de données pour : Nonexistent Country',
        '/not-found'
      );
      done();
    });
  });

  it('should return medals data for a country', (done) => {
    service.getMedalsByCountryName('Country A').subscribe((data) => {
      expect(data).toEqual([
        {
          name: 'gold',
          series: [
            { name: '1988-Seoul', value: 3 },
            { name: '1992-Barcelona', value: 7 },
          ],
        },
        {
          name: 'silver',
          series: [
            { name: '1988-Seoul', value: 2 },
            { name: '1992-Barcelona', value: 3 },
          ],
        },
        {
          name: 'bronze',
          series: [
            { name: '1988-Seoul', value: 1 },
            { name: '1992-Barcelona', value: 2 },
          ],
        },
        {
          name: 'total',
          series: [
            { name: '1988-Seoul', value: 6 },
            { name: '1992-Barcelona', value: 12 },
          ],
        },
      ]);
      done();
    });
  });

  it('should handle error when medals data is not found', (done) => {
    const countryName$ = new BehaviorSubject<string | null>(
      'Nonexistent Country'
    );
    service.getLineChartDataOrHandleError(countryName$).subscribe((data) => {
      expect(data).toEqual([]);
      expect(mockErrorService.setErrorAndNavigate).toHaveBeenCalledWith(
        'Pas de données de médailles pour : Nonexistent Country',
        '/not-found'
      );
      done();
    });
  });
});
