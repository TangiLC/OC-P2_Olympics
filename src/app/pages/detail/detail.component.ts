import { OlympicService } from 'src/app/core/services/olympic.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
  country$: Observable<CountryDetail | undefined>;

  constructor(
    private route: ActivatedRoute,
    private OlympicService: OlympicService
  ) {
    const countryName = this.route.snapshot.paramMap.get('countryName');
    this.country$ = this.OlympicService.getCountryByName(countryName || '');
  }

  ngOnInit(): void {}
}
