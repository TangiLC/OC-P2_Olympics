import {
  Component,
  Input,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-medals-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-line-chart.component.html',
  styleUrls: ['./medals-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MedalsLineChartComponent {
  @Input() lineChartData: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];
  view: [number, number] = [0.75 * window.innerWidth, 0.4 * window.innerHeight];
  showLegend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = window.innerWidth > 700;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals';
  colorScheme: Color = {
    name: 'MedalsColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ffb14e', '#ccccd4', '#b87333', '#04838f'],
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateViewDimensions();
  }

   //responsive resize (portrait to landscape screen ?)
  private updateViewDimensions(): void {
    const width =
      window.innerWidth > 700
        ? Math.min(0.75 * window.innerWidth, 1400)
        : 0.9 * window.innerWidth;
    const height = Math.min(0.5 * window.innerHeight, 800);
    this.view = [width, height];
    this.showYAxisLabel = window.innerWidth > 700;
  }

  ngOnInit() {
    this.updateViewDimensions();
  }
}
