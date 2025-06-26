import { Component, OnInit, Input } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { PortfolioByAgent } from '../../../../agent/view-portfolio/view-portfolio.model';

@Component({
  selector: 'app-portfolio-pie-chart',
  templateUrl: './portfolio-pie-chart.component.html',
  styleUrls: ['./portfolio-pie-chart.component.css']
})
export class PortfolioPieChartComponent implements OnInit {

  @Input() chartTitle: string;
  @Input() portfolioByAgent: PortfolioByAgent[];
  @Input() chartType: string;
  pipe: any = new PercentPipe('en-US');


  constructor() {}

  customizeText(arg) {
    return arg.valueText + ' %';
  }

  customizeTooltip(arg) {
    return { text: arg.argumentText + ': ' + '<b>' + arg.valueText + ' %' + '<b>' };
  }

  ngOnInit() {
  }

}
