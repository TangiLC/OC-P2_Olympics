import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

interface CountryData {
  name: string;
  totalParticipations: number;
  totalMedalCount: number[];
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
            acc[0] + participation.medalsCount[0], // Or
            acc[1] + participation.medalsCount[1], // Argent
            acc[2] + participation.medalsCount[2], // Bronze
          ];
        },
        [0, 0, 0]
      );

      return { name, totalParticipations, totalMedalCount };
    });
    const maxTotalParticipations = Math.max(
      ...countryData.map((country: any) => country.totalParticipations)
    );

    this.olympicStats$.next({ countryData, maxTotalParticipations });
  }

  getOlympicStats() {
    return this.olympicStats$.asObservable();
  }
}
