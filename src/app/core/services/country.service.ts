import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, defaultIfEmpty } from 'rxjs/operators';
import { OlympicsService } from './olympics.service';
import { ErrorService } from './error.service';
import { CountryDetail, CountryTotalData } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(
    private olympicsService: OlympicsService,
    private errorService: ErrorService
  ) {}

  setSelectedCountry(countryName: string): void {
    // Logic remains unchanged
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

  getCountryDataOrHandleError(
    countryName$: Observable<string | null>
  ): Observable<CountryTotalData | undefined> {
    return countryName$.pipe(
      switchMap((countryName) =>
        countryName
          ? this.getCountryDataByName(countryName).pipe(
              tap((data) => {
                if (!data) {
                  this.errorService.setErrorAndNavigate(
                    `Pas de données pour : ${countryName}`,
                    '/404'
                  );
                }
              })
            )
          : of(undefined)
      )
    );
  }

  getLineChartDataOrHandleError(
    countryName$: Observable<string | null>
  ): Observable<{ name: string; series: { name: string; value: number }[] }[]> {
    return countryName$.pipe(
      switchMap((countryName) =>
        countryName
          ? this.getMedalsByCountryName(countryName).pipe(
              tap((data) => {
                if (!data || data.length === 0) {
                  this.errorService.setErrorAndNavigate(
                    `Pas de données de médailles pour : ${countryName}`,
                    '/404'
                  );
                }
              }),
              defaultIfEmpty([])
            )
          : of([])
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
