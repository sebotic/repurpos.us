import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
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

  @Output() structsOn: EventEmitter<boolean> = new EventEmitter<boolean>();

  // --- Plot sizing ---
  private margin: any = { top: 70, bottom: 0, left: 160, right: 40, colorbar: 20, xaxis: 15 };
  private width: number;
  private height: number;


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

  // showStructs() {
  //   console.log("showing")
  //   console.log(this.structsOn)
  //   this.structsOn.emit(true)
  //   console.log(this.structsOn)
  // }

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

    this.dotgrp = this.chart.append('g')
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
  updateChart($compile) {
    console.log("UPDATING")
    console.log(this.data)

    var t = d3.transition()
      .duration(1000);

    // update domains when data changes
    this.x.domain(this.assay_domain);
    this.y.domain(this.data.map(function(d) { return d.calibr_id; }));

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
    ylinks.exit()
    // .transition(t)
    //   .style("fill-opacity", 1e-6)
      // .duration(2000)
      .remove();

    // // child selector: nested rectangle.
    var ytext = ylinks.select('.cmpd-name');

    // append `a` element to each parent
    var ylinksEnter = ylinks
      .enter().append('a')
      .attr('class', 'y-link');

    // Append text (children to `a` wrapper)
    var ytextEnter = ylinksEnter.append('text')
      .attr('class', 'cmpd-name')
      .attr('x', -6)
      .attr('y', d => this.y(d.calibr_id))
      .style("fill-opacity", 1e-6)
      .transition(t)
      .style("fill-opacity", 1);

    // Update the parent links
    ylinks.merge(ylinksEnter)
      .transition(t)
      .attr('id', function(d) {
        return d.calibr_id;
      })
      .attr('xlink:href', function(d) {
        return d.url;
      });

    // Update the children text values
    ytext.merge(ytextEnter)
      .classed('pointer', function(d) {
        if (d.url) {
          return true;
        } else {
          return false;
        }
      })
      .attr('id', d => d.calibr_id)
      .text(d => d.name)
      .style("fill-opacity", 1e-6)
      // .transition(t)
      .style("fill-opacity", 1);

    // --- LOLLIS ---
    const lollis = this.dotgrp.selectAll('.lollipop')
      .data(this.data);

    lollis.exit().remove();


    var lolliEnter = lollis.enter().append('line')
      .attr('class', 'lollipop')
      .attr('x1', 0)
      .attr('y1', d => this.y(d.calibr_id))
      .attr('y2', d => this.y(d.calibr_id))
      .attr('stroke-dasharray', '6,6');

    lollis.merge(lolliEnter)
      .transition(t)
        .attr('x2', d => this.x(d.ac50))
        .attr('id', d => d.calibr_id);

    // --- DOTS ---
    var dotLinks = this.dotgrp.selectAll('.dot-link')
      .data(this.data);


    dotLinks.exit()
      // .transition(t)
      .remove();

    var dots = dotLinks.select('.assay-avg');

    // append `a` element to each parent
    var dotlinksEnter = dotLinks
      .enter().append('a')
      .attr('class', 'dot-link');

    // Append text (children to `a` wrapper)
    var dotEnter = dotlinksEnter.append('circle')
      .attr('class', 'assay-avg')
      .attr('r', this.dot_size)
      .attr('cy', d => this.y(d.calibr_id));

    // Update the parent links
    dotLinks.merge(dotlinksEnter)
    .attr('id', d => d.calibr_id)
      .attr('xlink:href', function(d) {
        return d.url;
      })
      .classed('pointer', function(d) {
        if (d.url) {
          return true;
        } else {
          return false;
        }
      });

    // Update the children dot values
    dots.merge(dotEnter)
      .attr('id', d => d.calibr_id)
      .transition(t)
      .attr('cx', d => this.x(d.ac50))
      .style('fill', d => this.colorScale(Math.log10(d.ac50)));

    // Rollover behavior: y-axis
    this.cmpd_names.selectAll('.y-link text')
      .on('mouseover', function() {
        // // TODO: functionalize the turning on/off: everything off, #id selected on.
        var selected = "#" + (this.id);
        console.log(selected)

        // dim the rest of the axis
        d3.selectAll(".y-link text")
          .classed("inactive", true);

        // turn off lollipop sticks, circles
        d3.selectAll('.assay-avg')
          .classed("inactive", true)

        d3.selectAll('.lollipop')
          .classed("inactive", true)

        // turn on selected
        d3.selectAll(selected)
        .classed("active", true)
          .classed("inactive", false);

        // turn on structures
        console.log('mouse!')
        console.log($compile(this.dot_size))
        // showStruct(this.textContent);
      })
      .on('mouseout', function() {
        // turn the axis back on
        d3.selectAll(".y-link text")
          .classed("active", false)
          .classed("inactive", false);

        // turn on lollipop sticks, circles
        d3.selectAll(".assay-avg")
          .classed("inactive", false);

          d3.selectAll(".lollipop")
            .classed("inactive", false);


        // // hideStruct();
      })

      // Rollover behavior: y-axis
      this.dotgrp.selectAll('.assay-avg')
        .on('mouseover', function() {

          // // var selected = "#" + remove_symbols(this.textContent);
          // // TODO:change to constant ID
          // // TODO: group lollis/circles; add IDs to them
          // // TODO: don't double select
          // // TODO: functionalize the turning on/off: everything off, #id selected on.
          var selected = "#" + (this.id);
          console.log(selected)

          // dim the rest of the axis
          d3.selectAll(".y-link text")
            .classed("inactive", true);

          // turn off lollipop sticks, circles
          d3.selectAll('.assay-avg')
            .classed("inactive", true)

          d3.selectAll('.lollipop')
            .classed("inactive", true)

          // turn on selected
          d3.selectAll(selected)
          .classed("active", true)
            .classed("inactive", false);

          // turn on structures
          // showStruct(this.textContent);
        })
        .on('mouseout', function() {
          // turn the axis back on
          d3.selectAll(".y-link text")
            .classed("active", false)
            .classed("inactive", false);

          // turn on lollipop sticks, circles
          d3.selectAll(".assay-avg")
            .classed("inactive", false);

            d3.selectAll(".lollipop")
              .classed("inactive", false);


          // // hideStruct();
        })

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
