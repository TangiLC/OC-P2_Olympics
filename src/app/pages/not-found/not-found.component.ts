import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OlympicsService } from 'src/app/core/services/olympics.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  errorMessage$: Observable<string | null>;
  constructor(
    private olympicsService: OlympicsService,
    private router: Router
  ) {
    this.errorMessage$ = this.olympicsService.errorMessage$.asObservable();
  }

  clearError(): void {
    this.olympicsService.errorMessage$.next(null);
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}
}
