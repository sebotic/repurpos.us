import { Component, OnInit, Input, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';

import * as d3 from 'd3';
import * as d3Chromatic from 'd3-scale-chromatic';

@Component({
  selector: 'app-assay-sparkline',
  templateUrl: './assay-sparkline.component.html',
  styleUrls: ['./assay-sparkline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssaySparklineComponent implements OnInit {
  @Input() currentVal: [number];
  @Input() assayMin: number;
  private assayMax: number = 1; // set baseline of 1 --> log(1) = 0
  private assayRange: [number, number];
  private colorMin: number = 1.25e-4; // minimum for color scale; based on the minimum of the global dataset, approx.

  @ViewChild('chart') private chartContainer: ElementRef;

  // --- Plot sizing ---
  private element: any;
  private element_dims: any;
  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  private width: number;
  private height: number;

  // --- Selectors ---
  private chart: any; // bar graph

  // --- Scales/Axes ---
  private x: any;
  private colorScale: any;
  private xAxis: any;

  constructor() { }

  ngOnInit() {
    this.assayRange = [this.assayMax, this.assayMin];
    this.createChart();
  }



  getSVGDims() {
    // Find container; define width/height of svg obj.
    this.element = this.chartContainer.nativeElement;
    this.element_dims = this.element.getBoundingClientRect();
    this.width = this.element_dims.width - this.margin.left - this.margin.right;
    this.height = this.element_dims.height - this.margin.top - this.margin.bottom;
  }

  // Data-independent setup
  createChart() {
    this.getSVGDims();

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // selectors
    this.chart = svg.append("g")
      .attr("id", "dotplot")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- x & y axes --
    this.x = d3.scaleLog()
      .range([0, this.width])
      .domain(this.assayRange);


    this.colorScale = d3
      .scaleSequential(d3Chromatic.interpolateGnBu)
      .domain([
        Math.log10(this.colorMin),
        Math.log10(this.assayRange[1])]);

    // this.xAxis = d3.axisBottom(this.x)
    //   .ticks(6, '.0e');

    // create initial x & y axis
    // svg.append('g')
    //   .attr('class', 'axis axis--x')
    //   .attr('transform', `translate(${this.margin.left}, ${this.height })`)
    //   .call(this.xAxis);


    svg.selectAll('.assay-rect')
      .data(this.currentVal)
      .enter().append('rect')
      .attr('class', 'assay-rect')
      .attr('width', d => this.x(d))
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', d => this.colorScale(Math.log10(d)));

  }

}
