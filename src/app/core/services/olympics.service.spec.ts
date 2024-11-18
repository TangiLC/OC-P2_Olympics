import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { OlympicsService } from './olympics.service';
import { ErrorService } from './error.service';
import { calculateStats } from './utils/calculate.utils';
import { CountryDetail, CountryTotalData } from '../models/Olympic';

describe('OlympicsService', () => {
  let service: OlympicsService;
  let httpMock: HttpTestingController;
  let mockErrorService: any;

  const mockOlympicData: CountryDetail[] = [
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
          athleteCount: 120,
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
          medalsCount: [15, 10, 5],
          athleteCount: 220,
        },
      ],
    },
  ];

  const mockOlympicStats = calculateStats(mockOlympicData);

  beforeEach(() => {
    mockErrorService = {
      setErrorAndNavigate: jasmine.createSpy('setErrorAndNavigate'),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OlympicsService,
        { provide: ErrorService, useValue: mockErrorService },
      ],
    });

    service = TestBed.inject(OlympicsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should initialize with default values', () => {
    expect(service.getOlympics()).toBeTruthy();
    expect(service.getOlympicStats()).toBeTruthy();
  });

  it('should load initial', (done) => {
    service['olympics$'].next(mockOlympicData);
    service.getOlympics().subscribe((olympics) => {
      expect(olympics).toEqual(mockOlympicData);
      done();
    });
  });

  it('should get Stats', (done) => {
    service['olympicStats$'].next(mockOlympicStats);
    service.getOlympicStats().subscribe((stats) => {
      expect(stats).toEqual(mockOlympicStats);
      done();
    });
  });

  it('should return olympics observable', (done) => {
    service['olympics$'].next(mockOlympicData);
    service.getOlympics().subscribe((data) => {
      expect(data).toEqual(mockOlympicData);
      done();
    });
  });

  it('should return olympic stats observable', (done) => {
    service['olympicStats$'].next(mockOlympicStats);
    service.getOlympicStats().subscribe((stats) => {
      expect(stats).toEqual(mockOlympicStats);
      done();
    });
  });

  it('should return pie chart data', (done) => {
    service['olympicStats$'].next(mockOlympicStats); // Initialise les données
    service.getPieChartData().subscribe((data) => {
      expect(data).toEqual([
        { name: 'Country A', value: 18 }, // 3+2+1+7+3+2
        { name: 'Country B', value: 48 }, // 10+5+3+15+10+5
      ]);
      done();
    });
  });

  it('should return default pie chart data if no stats are available', (done) => {
    service['olympicStats$'].next(null); // Pas de données simulées
    service.getPieChartData().subscribe((data) => {
      expect(data).toEqual([{ name: 'no data', value: 0 }]);
      done();
    });
  });
});
