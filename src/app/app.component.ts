import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicsService } from './core/services/olympics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  name = 'olympic-games-app';
  constructor(private olympicsService: OlympicsService) {}

  ngOnInit(): void {
    this.olympicsService.loadInitialData().pipe(take(1)).subscribe();
  }
}
