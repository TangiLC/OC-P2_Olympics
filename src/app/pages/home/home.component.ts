import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
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

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicStats$ = this.olympicService.getOlympicStats();
    this.pieChartData$ = this.olympicService.getOlympicStats().pipe(
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
