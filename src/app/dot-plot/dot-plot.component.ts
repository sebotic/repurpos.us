import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as d3Chromatic from 'd3-scale-chromatic';

@Component({
  selector: 'app-dot-plot',
  templateUrl: './dot-plot.component.html',
  styleUrls: ['./dot-plot.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DotPlotComponent implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  @Input() private assay_domain: Array<any>;
  @Input() private assay_type: string;


  // --- Plot sizing ---
  private margin: any = { top: 55, bottom: 0, left: 160, right: 40};
  private width: number;
  private height: number;


  // --- Selectors ---
  private chart: any; // dotplot
  private defs: any; // defs for svg

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private colorScale: any;
  private xAxis: any;
  private yAxis: any;

  // --- Selectors for enter/update with data ---


  // --- Plot contants ---
private dot_size: number = 5;

  constructor() { }

  ngOnInit() {
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

// Data-independent setup
  createChart() {

    // Find container; define width/height of svg obj.
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    // Append SVG
    const svg = d3.select(element)
      .append('svg')
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)

    this.chart = svg.append("g")
      .attr("id", "dotplot")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);


    // --- x & y axes --
    this.x = d3.scaleLog()
      .rangeRound([0, this.width]);

    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(0.05)
      .paddingOuter(0.35);

    this.colorScale = d3
        .scaleSequential(d3Chromatic.interpolateGnBu);

    this.xAxis = d3.axisTop(this.x)
      .ticks(6, '.0e')

    this.yAxis = d3.axisLeft(this.y);


 // create initial x & y axis
svg.append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

svg.append('g')
  .attr('class', 'axis axis--y')
  .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


  // -- color scalebar --
  const scalebar = this.chart.append("g")
  .attr("id", "scalebar");

  // scalebar based on https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
  this.defs = this.chart.append('defs');
  const linearGradient = this.defs.append('linearGradient')
    .attr('id', 'linear-gradient')
    // horizontal gradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");


  // Append multiple color stops by using D3's data/enter step

  const colorRange = d3Chromatic.schemeGnBu[9];

  linearGradient.selectAll("stop")
    .data(colorRange)
    .enter().append("stop")
    .attr("offset", function(d, i) {
      return i / (colorRange.length - 1);
    })
    .attr("stop-color", function(d) {
      return d;
    });

  // Draw the rectangle and fill with gradient
  scalebar.append("rect")
    .attr("id", "scalebar")
    .attr("width", this.width)
    .attr("height", 10)
    .attr("transform", "translate(0, -" + this.margin.top + ")")
    .style("fill", "url(#linear-gradient)");

  scalebar.append("text")
    .attr("class", "annotation-right annotation--x")
    .attr("transform", "translate(" + this.width + ", -" + "20" + ")")
    .text("more potent")

  scalebar.append("text")
    .attr("class", "annotation-left annotation--x")
    .attr("transform", "translate(" + 0 + ", -" + "20" + ")")
    .text("less potent")


  }

// Data-dependent calls; will change w/ pagination
  updateChart() {
  console.log("UPDATING")
  console.log(this.data)

  // update domains when data changes
  this.x.domain(this.assay_domain);
  this.y.domain(this.data.map(function(d) { return d.name; }));

  // update color domain
  // Code if using d3.scaleSequential
  this.colorScale.domain([Math.log10(this.assay_domain[0]),
  Math.log10(this.assay_domain[1])]);

  console.log(this.colorScale.domain())
  console.log(this.colorScale(-6))


  d3.select('.axis.axis--y')
    .call(this.yAxis);

d3.select('.axis.axis--x')
    .call(this.xAxis)
    .selectAll(".tick")
    .data(this.x.ticks(3), function(d) {  return d;
    }) // create a secondary set of ticks for minor scale; pulled from http://blockbuilder.org/mbostock/4349486
    .exit()
    .classed("minor", true);

  // --- LOLLIS ---
  const lollis = this.chart.selectAll('.lollipop')
    .data(this.data);

  lollis.exit().remove();

  // this.chart.selectAll('.lollipop').transition()
  // .attr('x1', 0)
  // .attr('x2', d => this.x(d.ac50))
  // .attr('y1', d => this.y(d.name))
  // .attr('y2', d => this.y(d.name))
  // .attr('stroke-dasharray', '6,6');

  lollis.enter().append('line')
  .attr('class', 'lollipop')
  .attr('x1', 0)
  .attr('x2', d => this.x(d.ac50))
  .attr('y1', d => this.y(d.name))
  .attr('y2', d => this.y(d.name))
  .attr('stroke-dasharray', '6,6');

// --- DOTS ---
const update = this.chart.selectAll('.assay-avg')
  .data(this.data);

update.exit().remove();

// this.chart.selectAll('.assay-avg').transition()
// .attr('cx', d => this.x(d.ac50))
// .attr('cy', d => this.y(d.name))
// .attr('r', this.dot_size);

update.enter().append('circle')
.attr('class', 'assay-avg')
.attr('cx', d => this.x(d.ac50))
.attr('cy', d => this.y(d.name))
.style('fill', d => this.colorScale(Math.log10(d.ac50)))
.attr('r', this.dot_size);


  }
}

// MAIN FUNCTION TO DRAW PLOT --------------------------------------------------
function draw_plot(current_page, current_tab) {
// Set y-domain; required to be within draw function, since changes each time.
// (TODO: clean up chemical names)
// this.data_currpage = this.data;


}

// --- helpers ---
// <<< count_types(array, type) >>>
// function count_types(array, type) {
//   var counter = 0;
//
//   for (var i = 0; i < array.length; i++) {
//     if (array[i] === type) {
//       counter++;
//     }
//   }
//   return counter;
// }
//
// // get rid of symbols in compound names
// function remove_symbols(d) {
//   return "_" + d.replace(/ /g, "").replace(/-/g, "").replace(/'/g, "").replace(/,/g, "");
// }
//
//
// // helper to get height in pixels based on the index value.
// function yByIdx(i, step, paddingOuter) {
//   return i * step + step * paddingOuter + step / 2;
// }

// # []  ----------------------------------------------------------------------------------------------------
// # []  ----------------------------------------------------------------------------------------------------
// # []  ----------------------------------------------------------------------------------------------------

// Example from Keath Milligan
// export class DotPlotComponent implements OnInit, OnChanges {
//   @ViewChild('chart') private chartContainer: ElementRef;
//   @Input() private data: Array<any>;
//   private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
//   private chart: any;
//   private width: number;
//   private height: number;
//   private xScale: any;
//   private yScale: any;
//   private colors: any;
//   private xAxis: any;
//   private yAxis: any;
//
//   constructor() { }
//
//   ngOnInit() {
//     this.createChart();
//     if (this.data) {
//       this.updateChart();
//     }
//   }
//
//   ngOnChanges() {
//     if (this.chart) {
//       this.updateChart();
//     }
//   }
//
//   createChart() {
//     const element = this.chartContainer.nativeElement;
//     this.width = element.offsetWidth - this.margin.left - this.margin.right;
//     this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
//     const svg = d3.select(element).append('svg')
//       .attr('width', element.offsetWidth)
//       .attr('height', element.offsetHeight);
//
//     // chart plot area
//     this.chart = svg.append('g')
//       .attr('class', 'bars')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
//
//     // define X & Y domains
//     const xDomain = this.data.map(d => d[0]);
//     const yDomain = [0, d3.max(this.data, d => d[1])];
//
//     // create scales
//     this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
//     this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);
//
//     // bar colors
//     this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);
//
//     // x & y axis
//     this.xAxis = svg.append('g')
//       .attr('class', 'axis axis-x')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
//       .call(d3.axisBottom(this.xScale));
//     this.yAxis = svg.append('g')
//       .attr('class', 'axis axis-y')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
//       .call(d3.axisLeft(this.yScale));
//   }
//
//   updateChart() {
//     // update scales & axis
//     this.xScale.domain(this.data.map(d => d[0]));
//     this.yScale.domain([0, d3.max(this.data, d => d[1])]);
//     this.colors.domain([0, this.data.length]);
//     this.xAxis.transition().call(d3.axisBottom(this.xScale));
//     this.yAxis.transition().call(d3.axisLeft(this.yScale));
//
//     const update = this.chart.selectAll('.bar')
//       .data(this.data);
//
//     // remove exiting bars
//     update.exit().remove();
//
//     // update existing bars
//     this.chart.selectAll('.bar').transition()
//       .attr('x', d => this.xScale(d[0]))
//       .attr('y', d => this.yScale(d[1]))
//       .attr('width', d => this.xScale.bandwidth())
//       .attr('height', d => this.height - this.yScale(d[1]))
//       .style('fill', (d, i) => this.colors(i));
//
//     // add new bars
//     update
//       .enter()
//       .append('rect')
//       .attr('class', 'bar')
//       .attr('x', d => this.xScale(d[0]))
//       .attr('y', d => this.yScale(0))
//       .attr('width', this.xScale.bandwidth())
//       .attr('height', 0)
//       .style('fill', (d, i) => this.colors(i))
//       .transition()
//       .delay((d, i) => i * 10)
//       .attr('y', d => this.yScale(d[1]))
//       .attr('height', d => this.height - this.yScale(d[1]));
//   }
// }
