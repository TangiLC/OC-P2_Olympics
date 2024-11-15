import {
  Component,
  Input,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { OlympicService } from '../../services/olympic.service';

@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-pie-chart.component.html',
  styleUrls: ['./medals-pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MedalsPieChartComponent {
  @Input() pieChartData: { name: string; value: number }[] | null = [];
  view: [number, number] = [
    Math.min(0.8 * window.innerWidth, 1260),
    Math.min(0.6 * window.innerHeight, 600),
  ];
  labels: boolean = window.innerWidth > 768;

  constructor(private router: Router, private olympicService: OlympicService) {}

  setTooltipText(data: { data: { label: string; value: number } }): string {
    return `${data.data.label}<br>🏅${data.data.value}`;
  }

  onSelect(data: { name: string }): void {
    const countryName = data.name;
    if (countryName) {
      this.olympicService.setSelectedCountry(countryName);
      this.router.navigate(['/detail', countryName]);
    }
  }

  onActivate(data: { entries: { name: string }[] }): void {
    const countryName =
      data.entries && data.entries[0] ? data.entries[0].name : null;
    if (countryName) {
      this.olympicService.setSelectedCountry(countryName);
    }
  }

  onDeactivate(data: { entries: { name: string }[] }): void {
    this.olympicService.setSelectedCountry('');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateViewDimensions();
  }

  private updateViewDimensions(): void {
    const width =
      window.innerWidth > 768
        ? Math.min(0.8 * window.innerWidth, 1260)
        : 0.9 * window.innerWidth;
    const height = Math.min(0.6 * window.innerHeight, 600);
    this.view = [width, height];
    this.labels = window.innerWidth > 768;
  }

  ngOnInit() {
    this.updateViewDimensions();
  }
}
