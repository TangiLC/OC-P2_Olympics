import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  errorMessage$: Observable<string | null>;
  constructor(private olympicService: OlympicService, private router: Router) {
    this.errorMessage$ = this.olympicService.errorMessage$.asObservable();
  }

  clearError(): void {
    this.olympicService.errorMessage$.next(null);
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}
}
