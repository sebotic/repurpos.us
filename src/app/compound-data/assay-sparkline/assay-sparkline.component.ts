import { Component, OnInit, Input, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';

import * as d3 from 'd3';
import * as d3Chromatic from 'd3-scale-chromatic';

@Component({
  selector: 'app-assay-sparkline',
  templateUrl: './assay-sparkline.component.html',
  styleUrls: ['./assay-sparkline.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class AssaySparklineComponent implements OnInit {
  @Input() currentVal: [number];
  @Input() assayMin: number;
  private assayMax: number = 1;
  private assayRange: [number, number];

  @ViewChild('chart') private chartContainer: ElementRef;

  // --- Plot sizing ---
  private element: any;
  private element_dims: any;
  // private margin: any = { top: 0, bottom: 20, left: 0, right: 0};
  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  private width: number;
  private height: number;
  private min_height: number = 40;


  // --- Selectors ---
  private chart: any; // dotplot
  private dotgrp: any; // dots + lollipops
  private cmpd_names: any; // y-axis: compound names + links
  private defs: any; // defs for svg

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private colorScale: any;
  private xAxis: any;
  private yAxis: any;


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

    // this.dotgrp = this.chart.append('g')
    //   .attr("class", "dots")
    //   .attr("id", "dots");
    //
    // this.cmpd_names = this.chart.append('g')
    //   .attr("id", "y-links");
    //
    // // --- x & y axes --
    this.x = d3.scaleLog()
      // this.x = d3.scaleLog()
      .range([0, this.width])
      .domain(this.assayRange);

    //
    // this.y = d3.scaleBand()
    //   .rangeRound([0, this.height])
    //   .paddingInner(0.05)
    //   .paddingOuter(0.35);
    //
    this.colorScale = d3
      .scaleSequential(d3Chromatic.interpolateGnBu)
      .domain([
        Math.log10(1.12e-5),
        // Math.log10(this.assayRange[0]),
        Math.log10(this.assayRange[1])]);
    // Math.log10(1.12e-5)]);
    //
    //
    this.xAxis = d3.axisBottom(this.x)
      .ticks(6, '.0e');
    //
    // this.yAxis = d3.axisLeft(this.y);
    //
    //
    // create initial x & y axis
    // svg.append('g')
    //   .attr('class', 'axis axis--x')
    //   .attr('transform', `translate(${this.margin.left}, ${this.height })`)
    //   .call(this.xAxis);

    // let sparkline = svg.append('g')
    // .attr('class', 'assay-rect');
    //

    svg.selectAll('.assay-rect')
      .data(this.currentVal)
      .enter().append('rect')
      .attr('class', 'assay-rect')
      .attr('width', d => this.x(d))
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', d => this.colorScale(Math.log10(d)));
    //
    //
    // // -- color scalebar --
    // const scalebar = this.chart.append("g")
    //   .attr("id", "scalebar");
    //
    // // scalebar based on https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
    // this.defs = this.chart.append('defs');
    // const linearGradient = this.defs.append('linearGradient')
    //   .attr('id', 'linear-gradient')
    //   // horizontal gradient
    //   .attr("x1", "0%")
    //   .attr("y1", "0%")
    //   .attr("x2", "100%")
    //   .attr("y2", "0%");
    //
    //
    // // Append multiple color stops by using D3's data/enter step
    // const colorRange = d3Chromatic.schemeGnBu[9];
    //
    // linearGradient.selectAll("stop")
    //   .data(colorRange)
    //   .enter().append("stop")
    //   .attr("offset", function(d, i) {
    //     return i / (colorRange.length - 1);
    //   })
    //   .attr("stop-color", function(d) {
    //     return d;
    //   });
    //
    // // Draw the rectangle and fill with gradient
    // scalebar.append("rect")
    //   .attr("id", "scalebar")
    //   .attr("width", this.width)
    //   .attr("height", 10)
    //   .attr("transform", "translate(0, -" + (this.margin.top) + ")")
    //   .style("fill", "url(#linear-gradient)");
    //
    // scalebar.append("text")
    //   .attr("class", "annotation-right annotation--x")
    //   .attr("transform", `translate(${this.width}, -${this.margin.colorbar + this.margin.xaxis})`)
    //   .text("more potent")
    //
    // scalebar.append("text")
    //   .attr("class", "annotation-left annotation--x")
    //   .attr("transform", `translate(0, -${this.margin.colorbar + this.margin.xaxis})`)
    //   .text("less potent")


  }

}
