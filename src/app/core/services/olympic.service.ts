import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

interface CountryData {
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
    countryData: CountryData[];
    maxTotalParticipations: number;
  } | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.calculateStats(value);
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        this.olympicStats$.next({ countryData: [], maxTotalParticipations: 0 });
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryByName(countryName: string): Observable<CountryDetail | undefined> {
    return this.olympics$.pipe(
      map((countries) => countries.find((c: any) => c.country === countryName))
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
  ): Observable<CountryData | undefined> {
    return this.olympicStats$.pipe(
      map((stats) =>
        stats?.countryData.find((country) => country.name === countryName)
      )
    );
  }
}
