import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import {
  catchError,
  tap,
  map,
  defaultIfEmpty,
  switchMap,
} from 'rxjs/operators';

interface CountryTotalData {
  name: string;
  totalParticipations: number;
  totalMedalCount: number[];
  totalAthleteCount: number;
}

interface Game {
  id: number;
  year: number;
  city: string;
  medalsCount: number[];
  athleteCount: number;
}

interface CountryDetail {
  id: number;
  country: number;
  participations: Game[];
}

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);
  private olympicStats$ = new BehaviorSubject<{
    countryData: CountryTotalData[];
    maxTotalParticipations: number;
  } | null>(null);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.calculateStats(value);
      }),
      catchError((error, caught) => {
        this.errorMessage$.next(
          `Données introuvables ou erreur serveur. ERR:${error.status}-${error.message}`
        );
        this.olympics$.next([]);
        this.olympicStats$.next({ countryData: [], maxTotalParticipations: 0 });
        this.router.navigate(['/404']);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryByName(countryName: string): Observable<CountryDetail | undefined> {
    return this.olympics$.pipe(
      switchMap((countries) => {
        if (!countries || countries.length === 0) {
          return this.loadInitialData().pipe(
            switchMap(() =>
              this.olympics$.pipe(
                map((updatedCountries) =>
                  updatedCountries.find((c: any) => c.country === countryName)
                )
              )
            )
          );
        } else {
          return of(countries.find((c: any) => c.country === countryName));
        }
      })
    );
  }

  private calculateStats(olympics: any) {
    if (!olympics) {
      this.olympicStats$.next({ countryData: [], maxTotalParticipations: 0 });
      return;
    }

    const countryData = olympics.map((country: any) => {
      const name = country.country;
      const totalParticipations = country.participations.length;
      const totalMedalCount = country.participations.reduce(
        (acc: number[], participation: any) => {
          return [
            acc[0] + participation.medalsCount[0], // Gold
            acc[1] + participation.medalsCount[1], // Silver
            acc[2] + participation.medalsCount[2], // Bronze
          ];
        },
        [0, 0, 0]
      );
      const totalAthleteCount = country.participations.reduce(
        (acc: number, participation: any) => acc + participation.athleteCount,
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
      ...countryData.map((country: any) => country.totalParticipations)
    );

    this.olympicStats$.next({ countryData, maxTotalParticipations });
  }

  getOlympicStats() {
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

  getMedalsByCountryName(countryName: string): Observable<any> {
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
