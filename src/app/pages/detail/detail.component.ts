import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, defaultIfEmpty, startWith } from 'rxjs/operators';
import { OlympicsService } from 'src/app/core/services/olympics.service';
import { CountryService } from 'src/app/core/services/country.service';

import { CountryTotalData } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  countryData$: Observable<CountryTotalData | undefined> = of(undefined);
  lineChartData$: Observable<
    { name: string; series: { name: string; value: number }[] }[]
  > = of([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicsService: OlympicsService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    const countryName$ = this.route.paramMap.pipe(
      map((params) => params.get('country')),
      tap((countryName) => {
        if (countryName) {
          this.countryService.setSelectedCountry(countryName);
        }
      })
    );

    this.countryData$ = countryName$.pipe(
      switchMap((countryName) =>
        countryName
          ? this.countryService.getCountryDataByName(countryName).pipe(
              tap((data) => {
                if (!data || (Array.isArray(data) && data.length === 0)) {
                  this.olympicsService.errorMessage$.next(
                    'Pas de données pour ce pays'
                  );
                  this.router.navigate(['/404']);
                }
              })
            )
          : of(undefined)
      )
    );

    this.lineChartData$ = countryName$.pipe(
      switchMap((countryName) =>
        countryName
          ? this.countryService
              .getMedalsByCountryName(countryName)
              .pipe(startWith([]), defaultIfEmpty([]))
          : of([])
      )
    );
  }
}
