import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  timer,
  takeUntil,
  Subject,
} from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { calculateStats } from './utils/calculate.utils';
import { CountryDetail, CountryTotalData } from '../models/Olympic';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class OlympicsService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<CountryDetail[] | null>(null);
  private olympicStats$ = new BehaviorSubject<{
    countryData: CountryTotalData[];
    maxTotalParticipations: number;
  } | null>(null);
  private refreshDataDelay = 5000;
  private destroy$ = new Subject<void>();
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  //get and normalize data from Mock, refresh every *refreshDataDelay (5min)
  //TODO validate if change to API call
  loadInitialData(): Observable<CountryDetail[]> {
    return timer(0, this.refreshDataDelay).pipe(
      takeUntil(this.destroy$),
      switchMap(() =>
        this.http.get<CountryDetail[]>(this.olympicUrl).pipe(
          tap((olympics) => {
            this.olympics$.next(olympics);
            this.olympicStats$.next(calculateStats(olympics));
          }),
          catchError((error) => {
            this.errorService.setErrorAndNavigate(
              `Données introuvables ou erreur serveur. ERR:${error.status}-${error.message}`,
              '/not-found'
            );
            this.olympics$.next([]);
            this.olympicStats$.next({
              countryData: [],
              maxTotalParticipations: 0,
            });
            return of([]);
          })
        )
      )
    );
  }
  //get raw data
  getOlympics(): Observable<CountryDetail[] | null> {
    return this.olympics$.asObservable();
  }
  //get normalized data
  getOlympicStats(): Observable<{
    countryData: CountryTotalData[];
    maxTotalParticipations: number;
  } | null> {
    return this.olympicStats$.asObservable();
  }

  //get normalized data suitable for pie-chart
  getPieChartData(): Observable<{ name: string; value: number }[]> {
    return this.getOlympicStats().pipe(
      map((stats) =>
        stats && stats.countryData
          ? stats.countryData.map((country) => ({
              name: country.name,
              value: country.totalMedalCount.reduce((acc, val) => acc + val, 0),
            }))
          : [{ name: 'no data', value: 0 }]
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
