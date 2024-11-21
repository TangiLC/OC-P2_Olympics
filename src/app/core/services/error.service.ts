import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, first } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessage = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessage.asObservable();
  private hasNavigated: boolean = false;

  constructor(private router: Router) {}

  //store error message
  setErrorMessage(message: string | null): void {
    this.errorMessage.next(message);
  }

  //retrieve error message
  getErrorMessage(): Observable<string | null> {
    return this.errorMessage$;
  }

  //navigate once after setting error message
  setErrorAndNavigate(msg: string | null, path: string): void {
    if (!this.hasNavigated) {
      this.hasNavigated = true;
      this.errorMessage.next(msg);
      this.errorMessage$
        .pipe(
          first(),
          tap((e) => {
            this.router.navigate([path]).then(() => {
              this.hasNavigated = false;
            });
          })
        )
        .subscribe();
    }
  }
}
