import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, defaultIfEmpty } from 'rxjs/operators';
import { OlympicsService } from './olympics.service';
import { CountryDetail, CountryTotalData } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private selectedCountry = new BehaviorSubject<string | null>(null);
  selectedCountry$ = this.selectedCountry.asObservable();

  constructor(private olympicsService: OlympicsService) {}

  setSelectedCountry(countryName: string): void {
    this.selectedCountry.next(countryName);
  }

  getCountryDataByName(
    countryName: string
  ): Observable<CountryTotalData | undefined> {
    return this.olympicsService
      .loadInitialData()
      .pipe(
        switchMap(() =>
          this.olympicsService
            .getOlympicStats()
            .pipe(
              map((stats) =>
                stats?.countryData.find(
                  (country) => country.name === countryName
                )
              )
            )
        )
      );
  }

  getMedalsByCountryName(
    countryName: string
  ): Observable<{ name: string; series: { name: string; value: number }[] }[]> {
    return this.olympicsService.getOlympics().pipe(
      switchMap((countries) =>
        countries && countries.length > 0
          ? of(countries)
          : this.olympicsService.loadInitialData()
      ),
      map((countries) => {
        const countryDetail = countries.find(
          (country) => country.country === countryName
        );
        if (!countryDetail) {
          return [];
        }

        const medalTypes = ['gold', 'silver', 'bronze'];
        const medalData = medalTypes.map((type, index) => ({
          name: type,
          series: countryDetail.participations.map((participation) => ({
            name: `${participation.year}-${participation.city}`,
            value: participation.medalsCount[index] || 0,
          })),
        }));
        const totalSeries = countryDetail.participations.map(
          (participation) => ({
            name: `${participation.year}-${participation.city}`,
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
