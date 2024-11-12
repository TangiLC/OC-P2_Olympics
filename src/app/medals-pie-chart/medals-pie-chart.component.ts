import { Component, Input, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountryService } from '../core/services/country.service';

@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-pie-chart.component.html',
  styleUrl: './medals-pie-chart.component.scss',
})
export class MedalsPieChartComponent {
  @Input() pieChartData: { name: string; value: number }[] | null = [];
  view: [number, number] = [1200, 700];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {}

  setTooltipText(data: { data: any }): string {
    return `${data.data.label}<br>🏅${data.data.value}`;
  }

  onSelect(data: any): void {
    console.log('Country selected :', JSON.stringify(data.name));
  }

  onActivate(data: any): void {
    const countryName =
      data.entries && data.entries[0] ? data.entries[0].name : null;
    if (countryName) {
      this.countryService.setSelectedCountry(countryName);
    }
    console.log('Mouse over:', countryName);
  }

  onDeactivate(data: any): void {
    this.countryService.setSelectedCountry('');
    console.log('Mouse out: null');
  }
}
