import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';

interface Country {
  id: number;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private flagsUrl = './assets/mock/flags.json';
  private countries$: Observable<Country[]>;
  private selectedCountry = new BehaviorSubject<string | null>(null);

  selectedCountry$: Observable<string | null> =
    this.selectedCountry.asObservable();
  selectedFlag$: Observable<string>;

  constructor(private http: HttpClient) {
    this.countries$ = this.http.get<Country[]>(this.flagsUrl);

    this.selectedFlag$ = this.selectedCountry$.pipe(
      switchMap((countryName) =>
        this.countries$.pipe(
          map((countries) => {
            const country = countries.find((c) => c.name === countryName);
            return country ? country.flag : ' ';
          })
        )
      )
    );
  }

  setSelectedCountry(countryName: string): void {
    this.selectedCountry.next(countryName);
  }

}
