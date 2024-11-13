import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import {
  catchError,
  tap,
  map,
  switchMap,
  defaultIfEmpty,
} from 'rxjs/operators';

import { Game } from '../models/Participation';
import { CountryDetail, CountryTotalData } from './../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private olympics$ = new BehaviorSubject<CountryDetail[] | null>(null);
  private olympicStats$ = new BehaviorSubject<{
    countryData: CountryTotalData[];
    maxTotalParticipations: number;
  } | null>(null);

  private selectedCountry = new BehaviorSubject<string | null>(null);

  errorMessage$ = new BehaviorSubject<string | null>(null);

  selectedCountry$: Observable<string | null> =
    this.selectedCountry.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  loadInitialData(): Observable<CountryDetail[]> {
    return this.http.get<CountryDetail[]>(this.olympicUrl).pipe(
      tap((olympics) => {
        this.olympics$.next(olympics);
        this.calculateStats(olympics);
      }),
      catchError((error) => {
        this.errorMessage$.next(
          `Données introuvables ou erreur serveur. ERR:${error.status}-${error.message}`
        );
        this.olympics$.next([]);
        this.olympicStats$.next({ countryData: [], maxTotalParticipations: 0 });
        this.router.navigate(['/404']);
        return of([]);
      })
    );
  }

  getOlympics(): Observable<CountryDetail[] | null> {
    return this.olympics$.asObservable();
  }

  setSelectedCountry(countryName: string): void {
    this.selectedCountry.next(countryName);
  }

  getCountryByName(countryName: string): Observable<CountryDetail | undefined> {
    return this.olympics$.pipe(
      switchMap((countries) => {
        if (!countries || countries.length === 0) {
          return this.loadInitialData().pipe(
            switchMap(() =>
              this.olympics$.pipe(
                map((updatedCountries) =>
                  updatedCountries?.find(
                    (c: CountryDetail) => c.country === countryName
                  )
                )
              )
            )
          );
        } else {
          return of(
            countries.find((c: CountryDetail) => c.country === countryName)
          );
        }
      })
    );
  }

  private calculateStats(olympics: CountryDetail[]): void {
    if (!olympics) {
      this.olympicStats$.next({ countryData: [], maxTotalParticipations: 0 });
      return;
    }

    const countryData = olympics.map((country: CountryDetail) => {
      const name = country.country;
      const totalParticipations = country.participations.length;
      const totalMedalCount = country.participations.reduce(
        (acc: number[], participation: Game) => {
          return [
            acc[0] + (participation.medalsCount[0] || 0),
            acc[1] + (participation.medalsCount[1] || 0),
            acc[2] + (participation.medalsCount[2] || 0),
          ];
        },
        [0, 0, 0]
      );
      const totalAthleteCount = country.participations.reduce(
        (acc: number, participation: Game) => acc + participation.athleteCount,
        0
      );

      return {
        name,
        totalParticipations,
        totalMedalCount,
        totalAthleteCount,
        participations: country.participations,
      };
    });

    const maxTotalParticipations = Math.max(
      ...countryData.map((country) => country.totalParticipations)
    );

    this.olympicStats$.next({ countryData, maxTotalParticipations });
  }

  getOlympicStats(): Observable<{
    countryData: CountryTotalData[];
    maxTotalParticipations: number;
  } | null> {
    return this.olympicStats$.asObservable();
  }

  getCountryDataByName(
    countryName: string
  ): Observable<CountryTotalData | undefined> {
    return this.loadInitialData().pipe(
      switchMap(() =>
        this.olympicStats$.pipe(
          map((stats) =>
            stats?.countryData.find((country) => country.name === countryName)
          )
        )
      )
    );
  }

  getMedalsByCountryName(
    countryName: string
  ): Observable<{ name: string; series: { name: string; value: number }[] }[]> {
    return this.getCountryByName(countryName).pipe(
      map((countryDetail) => {
        if (!countryDetail) {
          return [];
        }
        const medalTypes = ['gold', 'silver', 'bronze'];
        const medalData = medalTypes.map((type, index) => ({
          name: type,
          series: countryDetail.participations.map((participation) => ({
            name: participation.year.toString(),
            value: participation.medalsCount[index] || 0,
          })),
        }));
        const totalSeries = countryDetail.participations.map(
          (participation) => ({
            name: participation.year.toString(),
            value: participation.medalsCount.reduce((a, b) => a + b, 0),
          })
        );

        medalData.push({ name: 'total', series: totalSeries });
        return medalData;
      }),
      defaultIfEmpty([])
    );
  }
}
