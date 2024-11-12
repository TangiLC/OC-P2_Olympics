import { Component, Input, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-medals-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-line-chart.component.html',
  styleUrls: ['./medals-line-chart.component.scss'],
})
export class MedalsLineChartComponent implements OnInit {
  @Input() lineChartData: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];
  view: [number, number] = [700, 400];

  showLegend: boolean = false;
  showLabels: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals';

  constructor() {}

  ngOnInit(): void {}
}
