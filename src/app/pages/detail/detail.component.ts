import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    const countryName$ = this.route.paramMap.pipe(
      map((params) => {
        return params.get('country');
      }),
      tap((countryName) => {
        if (countryName) {
          this.countryService.setSelectedCountry(countryName);
        }
      })
    );
    countryName$.subscribe();

    this.countryData$ =
      this.countryService.getCountryDataOrHandleError(countryName$);

    this.lineChartData$ =
      this.countryService.getLineChartDataOrHandleError(countryName$);
  }
}
