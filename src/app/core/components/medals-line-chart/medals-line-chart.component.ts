import { Component, Input } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-medals-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-line-chart.component.html',
  styleUrls: ['./medals-line-chart.component.scss'],
})
export class MedalsLineChartComponent {
  @Input() lineChartData: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];
  view: [number, number] = [0.75 * window.innerWidth, .4*window.innerHeight];
  showLegend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals';
  colorScheme : Color = {
    name: 'MedalsColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ffb14e', '#dcdcdc', '#b87333', '#04838f'],
  };
}
