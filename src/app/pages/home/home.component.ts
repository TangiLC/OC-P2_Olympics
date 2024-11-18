import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicsService } from 'src/app/core/services/olympics.service';
import { CountryTotalData } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympicStats$: Observable<{
    countryData: CountryTotalData[];
    maxTotalParticipations: number;
  } | null> = of({ countryData: [], maxTotalParticipations: 0 });

  pieChartData$: Observable<{ name: string; value: number }[]> = of([
    { name: 'no data', value: 0 },
  ]);

  constructor(private olympicsService: OlympicsService) {}

  ngOnInit(): void {
    this.olympicStats$ = this.olympicsService.getOlympicStats();
    this.pieChartData$ = this.olympicsService.getPieChartData();
  }
}
