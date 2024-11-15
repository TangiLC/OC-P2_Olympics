import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { calculateStats } from './utils/calculate.utils';
import { CountryDetail, CountryTotalData } from '../models/Olympic';

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

  errorMessage$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  loadInitialData(): Observable<CountryDetail[]> {
    return timer(0, this.refreshDataDelay).pipe(
      switchMap(() =>
        this.http.get<CountryDetail[]>(this.olympicUrl).pipe(
          tap((olympics) => {
            this.olympics$.next(olympics);
            this.olympicStats$.next(calculateStats(olympics));
          }),
          catchError((error) => {
            this.errorMessage$.next(
              `Données introuvables ou erreur serveur. ERR:${error.status}-${error.message}`
            );
            this.olympics$.next([]);
            this.olympicStats$.next({
              countryData: [],
              maxTotalParticipations: 0,
            });
            this.router.navigate(['/404']);
            return of([]);
          })
        )
      )
    );
  }

  getOlympics(): Observable<CountryDetail[] | null> {
    return this.olympics$.asObservable();
  }

  getOlympicStats(): Observable<{
    countryData: CountryTotalData[];
    maxTotalParticipations: number;
  } | null> {
    return this.olympicStats$.asObservable();
  }
}
