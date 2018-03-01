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

  // --- Plot sizing ---
  private margin: any = { top: 70, bottom: 0, left: 160, right: 40, colorbar: 20, xaxis: 15 };
  private width: number;
  private height: number;


  // --- Selectors ---
  private chart: any; // dotplot
  private dots: any; // dots + lollipops
  private cmpd_names: any; // y-axis: compound names + links
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

    // selectors
    this.chart = svg.append("g")
      .attr("id", "dotplot")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.dots = this.chart.append('g')
      .attr("class", "dots");

    this.cmpd_names = this.chart.append('g')
      .attr("id", "y-links");

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
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top - this.margin.xaxis})`);


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
      .attr("transform", "translate(0, -" + (this.margin.top) + ")")
      .style("fill", "url(#linear-gradient)");

    scalebar.append("text")
      .attr("class", "annotation-right annotation--x")
      .attr("transform", `translate(${this.width}, -${this.margin.colorbar + this.margin.xaxis})`)
      .text("more potent")

    scalebar.append("text")
      .attr("class", "annotation-left annotation--x")
      .attr("transform", `translate(0, -${this.margin.colorbar + this.margin.xaxis})`)
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


    d3.select('.axis.axis--x')
      .call(this.xAxis);


    // --- COMPOUND NAMES ---
    // --- REDRAW Y-AXIS as text annotations, not axis, to link to repurpos.us page for each compound ---
    // NOTE: necessary, since adding in hrefs to an axis is kind of a pain in the ass. Simplest, not necessarily best, method.
    // enter/update logic based on https://github.com/d3/d3-selection/issues/86
    // JOIN: bind current data to the links / rectangles.
    // parent selector: outside `a` element for hyperlink
    var ylinks = this.cmpd_names.selectAll('.y-link')
      .data(this.data);

    // EXIT: remove any rectangles that no longer exist.
    ylinks.exit().remove();

    // // child selector: nested rectangle.
    var ytext = ylinks.select('#cmpd-name');

    // append `a` element to each parent
    var ylinksEnter = ylinks
      .enter().append('a').attr('class', 'y-link');

    // // Append rects (children to `a` wrapper)
    var ytextEnter = ylinksEnter.append('text').attr('id', 'cmpd-name')
      .attr('x', -6)
      .attr('y', d => this.y(d.name));

    // Update the parent links
    ylinks.merge(ylinksEnter)
      .attr('id', function(d) {
        return d.name;
      })
      .attr('xlink:href', function(d) {
        return d.url;
      });

    // Update the children rectangle values
    ytext.merge(ytextEnter)
      .text(d => d.name)
      .classed('pointer', function(d) {
        if (d.url) {
          return true;
        } else {
          return false;
        }
      });

    // --- LOLLIS ---
    const lollis = this.dots.selectAll('.lollipop')
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
    const update = this.dots.selectAll('.assay-avg')
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
