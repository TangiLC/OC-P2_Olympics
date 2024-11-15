import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicsService } from 'src/app/core/services/olympics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympicStats$: Observable<{
    countryData: {
      name: string;
      totalParticipations: number;
      totalMedalCount: number[];
    }[];
    maxTotalParticipations: number;
  } | null> = of({ countryData: [], maxTotalParticipations: 0 });

  pieChartData$: Observable<{ name: string; value: number }[]> = of([
    { name: 'no data', value: 0 },
  ]);

  constructor(private olympicsService: OlympicsService) {}

  ngOnInit(): void {
    this.olympicStats$ = this.olympicsService.getOlympicStats();
    this.pieChartData$ = this.olympicStats$.pipe(
      map((stats) =>
        stats && stats.countryData
          ? stats.countryData.map((country) => ({
              name: country.name,
              value: country.totalMedalCount.reduce((acc, val) => acc + val, 0),
            }))
          : [{ name: 'no data', value: 0 }]
      )
    );
  }
}
