import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, defaultIfEmpty, startWith } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';

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
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    const countryName$ = this.route.paramMap.pipe(
      map((params) => params.get('country')),
      tap((countryName) => {
        if (countryName) {
          this.olympicService.setSelectedCountry(countryName);
        }
      })
    );

    this.countryData$ = countryName$.pipe(
      switchMap((countryName) =>
        countryName
          ? this.olympicService.getCountryDataByName(countryName).pipe(
              tap((data) => {
                if (!data || (Array.isArray(data) && data.length === 0)) {
                  this.olympicService.errorMessage$.next(
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
          ? this.olympicService
              .getMedalsByCountryName(countryName)
              .pipe(startWith([]), defaultIfEmpty([]))
          : of([])
      )
    );
  }
}
