import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/core/services/error.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  errorMessage$: Observable<string | null>;

  constructor(private errorService: ErrorService, private router: Router) {
    this.errorMessage$ = this.errorService.getErrorMessage();
  }

  clearError(): void {
    this.errorService.clearErrorMessage();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}
}
