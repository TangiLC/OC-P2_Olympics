import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountryService } from 'src/app/core/services/country.service';

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

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  countryData$: Observable<CountryData | undefined> = of(undefined);
  public selectedFlag$: Observable<string> = of('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService,
    private countryService: CountryService
  ) {
    this.selectedFlag$ = this.countryService.getCountryFlag();
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.countryData$ = this.route.paramMap.pipe(
      map((params) => params.get('country')),
      tap((countryName) => {
        if (countryName) {
          this.countryService.setSelectedCountry(countryName);
        }
      }),
      switchMap((countryName) =>
        countryName
          ? this.olympicService.getCountryDataByName(countryName)
          : of(undefined)
      )
    );
  }

}
