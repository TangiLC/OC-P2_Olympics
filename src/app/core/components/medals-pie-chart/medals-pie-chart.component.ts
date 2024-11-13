import {
  Component,
  Input,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
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
  view: [number, number] = [0.5 * window.innerWidth, 0.45 * window.innerWidth];

  constructor(private countryService: CountryService, private router: Router) {}

  setTooltipText(data: { data: any }): string {
    return `${data.data.label}<br>🏅${data.data.value}`;
  }

  onSelect(data: any): void {
    const countryName = data.name;
    console.log('country selected', countryName);
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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateViewDimensions();
  }

  private updateViewDimensions(): void {
    const width = Math.min(0.7 * window.innerWidth, 1200);
    const height = Math.min(0.6 * window.innerHeight, 600);
    this.view = [width, height];
  }

  ngOnInit() {
    this.updateViewDimensions();
  }
}
