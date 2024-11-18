import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, tap,first } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessage = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessage.asObservable();
  private hasNavigated: boolean = false;

  constructor(private router: Router) {}

  setErrorMessage(message: string): void {
    this.errorMessage.next(message);
  }

  clearErrorMessage(): void {
    this.errorMessage.next(null);
  }

  getErrorMessage(): Observable<string | null> {
    return this.errorMessage$;
  }

  clearAndNavigate(path: string): void {
    this.clearErrorMessage();
    this.errorMessage$
      .pipe(
        first(),
        tap((e) => {
          //console.log('clear error', e);
          this.router.navigate([path]).then(() => {
            this.hasNavigated = false;
          });
        })
      )
      .subscribe();
    this.router.navigate([path]);
  }

  setErrorAndNavigate(message: string, path: string): void {
    if (!this.hasNavigated) {
      this.hasNavigated = true;
      this.errorMessage.next(message);

      this.errorMessage$
        .pipe(
          first(),
          tap((e) => {
            //console.log('display error', e);
            this.router.navigate([path]).then(() => {
              this.hasNavigated = false;
            });
          })
        )
        .subscribe();
    }
  }
}
