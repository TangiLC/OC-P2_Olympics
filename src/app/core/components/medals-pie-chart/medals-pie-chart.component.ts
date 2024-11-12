import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-pie-chart.component.html',
  styleUrl: './medals-pie-chart.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MedalsPieChartComponent {
  @Input() pieChartData: { name: string; value: number }[] | null = [];
  view: [number, number] = [.65*window.innerHeight, .65*window.innerHeight];

  constructor(private countryService: CountryService, private router: Router) {}

  ngOnInit(): void {}

  setTooltipText(data: { data: any }): string {
    return `${data.data.label}<br>🏅${data.data.value}`;
  }

  onSelect(data: any): void {
    const countryName = data.name;
    console.log('country selected',countryName)
    if (countryName) {
      this.countryService.setSelectedCountry(countryName);
      this.router.navigate(['/detail', countryName]);
    }
  }

  onActivate(data: any): void {
    const countryName =
      data.entries && data.entries[0] ? data.entries[0].name : null;
    if (countryName) {
      this.countryService.setSelectedCountry(countryName);
    }
  }

  onDeactivate(data: any): void {
    this.countryService.setSelectedCountry('');
  }
}
