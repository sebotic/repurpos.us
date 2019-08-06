import { Component, OnInit, OnChanges, Input, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { ColorPaletteService } from '../../_services/color-palette.service'

import * as d3 from 'd3';
import * as chroma from 'chroma-js';

@Component({
  selector: 'app-barplot',
  templateUrl: './barplot.component.html',
  styleUrls: ['./barplot.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BarplotComponent implements OnInit, OnChanges {
  @ViewChild('barplot') private chartContainer: ElementRef;
  @Input() colorScale;
  @Input() data: string[];
  @Input() yDomain: string[];
  // = ["cell-based", "cell viability", "high-content imaging", "biochemical", "enzymatic", "cytotox", "phenotypic"];
  value_counts: Object[];
  selected: string[];

  // plot sizes
  private element: any;
  private margin: any = { top: 1, bottom: 1, left: 115, right: 30 };
  private width: number = 75;
  private height: number = 0;
  private bar_height: number = 21;
  private spacing: number = 0.2;

  // --- Selectors ---
  private chart: any;
  private yAxis: any;

  // --- Scales/Axes ---
  private x: any;
  private y: any;


  constructor(private colorSvc: ColorPaletteService) {
  }


  ngOnInit() {
    this.colorSvc.selectedTypeState.subscribe(selectedTypes => {
      if (selectedTypes) {
        this.selected = selectedTypes;
      } else {
        this.selected = this.yDomain;
      }
    })
    
    this.createChart();

    this.drawChart();
  }

  ngOnChanges() {
    this.drawChart();
  }

  prepData() {
    this.value_counts = d3.nest()
      .key((d: any) => d)
      .rollup((leaves: any) => leaves.length)
      .entries(this.data)
      .sort((a: any, b: any) => b.value - a.value || a.key - b.key);

    // add in missing data
    let keys = this.value_counts.map((d: any) => d.key);

    let missing_data = this.yDomain.filter(d => !keys.includes(d));

    missing_data.forEach(d => {
      this.value_counts.push({ key: d, value: 0 });
    })

    this.value_counts.forEach((d: any) => {
      d['selected'] = this.selected.includes(d.key) ?
        true : false;
    })
  }

  createChart() {
    this.element = this.chartContainer.nativeElement;

    let svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.chart = svg.append("g")
      .attr("id", "bars")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- x & y axes --
    this.x = d3.scaleLinear()
      .rangeRound([0, this.width]);


    this.height = this.yDomain.length * this.bar_height;

    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(this.spacing)
      .paddingOuter(0)
      .domain(this.yDomain);
  }

  drawChart() {
    if (this.element) {
      this.prepData();

      // this.height = this.value_counts.length * this.bar_height;

      d3.select('.barplot')
        .attr("height", this.height + this.margin.top + this.margin.bottom);

      // --- x & y axes --
      this.x
        .domain([0, <any>d3.max(this.value_counts, (d: any) => d.value)]);

      // this.y
      // .rangeRound([0, this.height])
      // .domain(this.value_counts.map((d: any) => d.key));

      // --- selectors
      const bar_group = this.chart
        .selectAll(".bar-group")
        .data(this.value_counts);

      let barRect = bar_group.select(".assay-rect");
      let barText = bar_group.select(".y-label");
      let checkboxes = bar_group.select(".checkbox");
      let checkmarks = bar_group.select(".checkmark");

      // --- exit ---
      bar_group.exit().remove();

      // --- enter ---
      let barGroupEnter = bar_group
        .enter().append("g")
        .attr("class", "bar-group");

      let barEnter = barGroupEnter
        .append("rect")
        .attr("class", "rect assay-rect")
        .attr("height", this.y.bandwidth());

      let textEnter = barGroupEnter
        .append("text")
        .attr("class", "y-label");

      let checkEnter = barGroupEnter
        .append("rect")
        .attr("class", "checkbox");

      let checkmarkEnter = barGroupEnter
        .append("polyline")
        .attr("class", "checkmark");

      // --- update/merge ---
      bar_group.merge(barGroupEnter)
        .attr("id", (d: any) => d.key)


      barRect.merge(barEnter)
        .transition()
        .duration(1000)
        .attr("x", (d: any) => 0)
        .attr("y", (d: any) => this.y(d.key))
        .attr("width", (d: any) => this.x(d.value))
        .attr("stroke", (d: any) => this.colorScale(d.key))
        .attr("fill", (d: any) => chroma(this.colorScale(d.key)).luminance(0.75));

      barText.merge(textEnter)
        .attr("x", (d: any) => 0)
        .attr("dx", (d: any) => -5)
        .attr("y", (d: any) => this.y(d.key) + this.y.bandwidth() / 2)
        .style("font-size", d3.min([this.y.bandwidth(), 12]))
        .text((d: any) => d.key)
        .attr("fill", (d: any) => this.colorScale(d.key));

      checkboxes.merge(checkEnter)
        .attr("x", (d: any) => this.width + 10)
        .attr("y", (d: any) => this.y(d.key))
        .attr("width", this.y.bandwidth())
        .attr("height", this.y.bandwidth())
        .attr("stroke", (d: any) => this.colorScale(d.key));
      // .attr("fill", (d: any) => d.selected ?  chroma(this.colorScale(d.key)).luminance(0.6, "hsl") : "white");

      checkmarks.merge(checkmarkEnter)
        // .select(function(d) { return d.selected ? this : null })
        .attr("transform", d => `translate(${this.width + 10},${this.y(d.key)})`)
        .attr("points", d => d.selected ? `${this.y.bandwidth() * 0.2},${this.y.bandwidth() * 0.35} ${this.y.bandwidth() * 0.35},${this.y.bandwidth() * 0.65} ${this.y.bandwidth() * 0.8},${this.y.bandwidth() * 0.25}` : '')
        .attr("stroke", (d: any) => this.colorScale(d.key));


      // --- click listener ---
      d3.selectAll(".checkbox")
        .on("click", (selected: any, idx) => {
          this.value_counts[idx]['selected'] = !selected.selected;

          let selected_on = this.value_counts.filter((d: any) => d.selected).map((d: any) => d.key);
          this.colorSvc.selectedTypeSubject.next(selected_on)
        })
    }
  }

}
