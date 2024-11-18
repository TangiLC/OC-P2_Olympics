import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessage = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessage.asObservable();

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

  setErrorAndNavigate(message: string, path: string): void {
    this.setErrorMessage(message);
    this.router.navigate([path]);
  }
}
