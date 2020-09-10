import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as d3Chromatic from 'd3-scale-chromatic';
import { CmpdTooltipComponent } from './cmpd-tooltip/cmpd-tooltip.component';

import { Subscription } from 'rxjs/subscription';

import { AssayDataService } from '../../_services/index';


@Component({
  selector: 'app-dot-plot',
  templateUrl: './dot-plot.component.html',
  styleUrls: ['./dot-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DotPlotComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  private data: Array<any>;
  public tooltipData: any;

  // Grab the domain of the the assays from the full dataset for a given assay.
  private assay_domain: number[];
  private domainSubscription: Subscription;
  private dataSubscription: Subscription;

  // @Output() svgHeightEmitter: EventEmitter<number> = new EventEmitter<number>(
  // );

  // --- Plot sizing ---
  private element: any;
  private element_dims: any;
  private margin: any = { top: 70, bottom: 0, left: 300, right: 40, colorbar: 20, xaxis: 15, pages: 40 };
  private width: number;
  private height: number;
  private min_height: number = 400;


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

  // --- Plot contants ---
  private dot_size: number = 5;
  private struct_height: number = 320; // empirically determined height of entire structure container, based on structure height of 150 px (since includes table as well)
  private struct_width = 200; // width of structure, based on image.

  svg_height: number;

  constructor(private dataSvc: AssayDataService) {
    this.domainSubscription = dataSvc.assayDomainSubject$.subscribe(domain => {
      this.assay_domain = domain;
    })

    this.dataSubscription = this.dataSvc.filteredDataSubject$.subscribe(data => {
      this.data = data;

      if (this.chart) {
        this.updateChart();
      }
    })
  }

  ngOnInit() {
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }


  ngOnDestroy() {
    // reset all parameters for the next time...
    this.dataSvc.clearAssayData();

    this.domainSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

  resizePlot(event) {
    this.updateChartSize();
    if (this.data) {
      this.updateChart();
    }
  }


  getSVGDims() {
    // Find container; define width/height of svg obj.
    this.element = this.chartContainer.nativeElement;
    this.element_dims = this.element.getBoundingClientRect();
    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = Math.max(this.min_height, window.innerHeight - this.element_dims.top) - this.margin.top - this.margin.bottom - this.margin.pages;
  }

  updateChartSize() {
    this.getSVGDims();
    let svg = d3.select('.svg_dotplot');

    svg.attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // Update things that change with widths
    // --- x & y axes --
    this.x = d3.scaleLog()
      .rangeRound([0, this.width]);

    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(0.05)
      .paddingOuter(0.35);

    this.xAxis = d3.axisTop(this.x)
      .tickValues(d3.range(-10, -4, 0.25).map(d => Math.pow(10, d)).filter(d => d <= this.assay_domain[0] && d >= this.assay_domain[1]));

    // create initial x & y axis
    d3.select('.axis--x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top - this.margin.xaxis})`);


    let scalebar = d3.select("#scalebar");

    // Draw the rectangle and fill with gradient
    scalebar
      .attr("width", this.width);

    scalebar.select('rect')
      .attr("width", this.width);

    scalebar.select(".annotation-right")
      .attr("transform", `translate(${this.width}, -${this.margin.colorbar + this.margin.xaxis})`);

    // d3.select(".annotation-left")
    //   .attr("transform", `translate(0, -${this.margin.colorbar + this.margin.xaxis})`)

  }

  // Data-independent setup
  createChart() {
    this.getSVGDims();

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "svg_dotplot")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // Container for the gradients
    // adapted frin http://bl.ocks.org/nbremer/d3189be2788ad3ca825f665df36eed09
    var defs = svg.append("defs");
    var filter = defs.append("filter")
      .attr("id", "glow");

    filter.append("feGaussianBlur")
      .attr("class", "blur")
      .attr("stdDeviation", "4.5")
      .attr("result", "coloredBlur");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    // selectors
    this.chart = svg.append("g")
      .attr("id", "dotplot")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.dotgrp = this.chart.append('g')
      .attr("class", "dots")
      .attr("id", "dots");

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
      .tickFormat(d3.format(".0e"));


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
    // console.log(this.data)
    if (this.data && this.data.length > 0) {
      var t = d3.transition()
        .duration(1000);

      // update domains when data changes
      this.x.domain(this.assay_domain);
      this.y.domain(this.data.map(d => d.key));

      this.xAxis
        .tickValues(d3.range(-10, -4, 0.25)
          .map(d => Math.pow(10, d))
          .filter(d => d <= this.assay_domain[0] && d >= this.assay_domain[1]));

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
        .transition(t)
        .style("fill-opacity", 1e-6)
        .duration(0)
        .remove();

      // // child selector: nested rectangle.
      var ytext = ylinks.select('.cmpd-name');
      var ytextGlow = ylinks.select('.cmpd-name-shadow');

      // append `a` element to each parent
      var ylinksEnter = ylinks
        .enter().append('a')
        .attr('class', 'y-link');

      // Append text (children to `a` wrapper)

      var ytextGlowEnter = ylinksEnter.append('text')
        .attr('class', 'cmpd-name-shadow')
        .attr('x', -6)
        .attr('y', d => this.y(d.key))
        .style("fill-opacity", 1e-6)
        .style("fill", "#f1ff1c")
        .transition(t)
        .style("fill-opacity", 0.5);

      var ytextEnter = ylinksEnter.append('text')
        .attr('class', 'cmpd-name')
        .attr('x', -6)
        .attr('y', d => this.y(d.key))
        // .style("fill-opacity", 1e-6)
        // .transition(t)
        .style("fill-opacity", 1);




      // Update the parent links
      ylinks.merge(ylinksEnter)
        // .transition(t)
        .attr('id', function(d) {
          return d.key;
        })
        .attr('xlink:href', function(d) {
          return d.value.url;
        });

      // Update the children text values
      ytextGlow.merge(ytextGlowEnter)
        .attr('id', d => d.key)
        .text(d => d.value.name)
        .style("filter", "url(#glow)")
        .style("fill-opacity", 1)
        .transition(t)
        .style("fill-opacity", 1e-5)

      ytext.merge(ytextEnter)
        .attr('id', d => d.key)
        .text(d => d.value.name)


      // --- LOLLIS ---
      const lollis = this.dotgrp.selectAll('.lollipop')
        .data(this.data);

      lollis.exit().remove();


      var lolliEnter = lollis.enter().append('line')
        .attr('class', 'lollipop')
        .attr('x1', 0)
        .attr('y1', d => this.y(d.key))
        .attr('y2', d => this.y(d.key))
        .attr('stroke-dasharray', '6,6');

      lollis.merge(lolliEnter)
        .transition(t)
        .attr('x2', d => this.x(d.value.min))
        .attr('id', d => d.key);

      // --- DOTS - non-average values ---
      var dotLinks = this.dotgrp.selectAll(".dot-link")
        .data(this.data);

      dotLinks.exit().remove();

      let dotLinksEnter = dotLinks
        .enter()
        .append("a")
        .attr("class", "ac50 dot-link")
        .attr("transform", d => `translate(0, ${this.y(d.key)})`);

      // update parent links
      dotLinks.merge(dotLinksEnter)
        .attr("id", d => d.key)
        .attr("xlink:href", d => d.value.url)
        .classed("pointer", true);


      var dots = this.dotgrp
        .selectAll(".dot-link")
        .selectAll(".assay-val")
        .data(d => d.value.ac50);

      dots.exit().remove();

      let dotEnter = dots
        .enter()
        .append("circle")
        .attr("r", this.dot_size * 0.7)
        .attr("class", "assay-val");

      // update children circles
      dots.merge(dotEnter)
        .transition(t)
        .attr("cx", d => this.x(d))

      // --- AVERAGE DOTS ---
      var avgLinks = this.dotgrp.selectAll('.avg-link')
        .data(this.data);


      avgLinks.exit()
        // .transition(t)
        .remove();

      var avgs = avgLinks.select('.assay-avg');


      // append `a` element to each parent
      var avglinksEnter = avgLinks
        .enter().append('a')
        .attr('class', 'ac50 avg-link');

      // Append circle (children to `a` wrapper)
      var avgEnter = avglinksEnter.append('circle')
        .attr('class', 'assay-avg')
        .attr('r', this.dot_size)
        .attr('cy', d => this.y(d.key));



      // Update the parent links
      avgLinks.merge(avglinksEnter)
        .attr('id', d => d.key)
        .attr('xlink:href', function(d) {
          return d.url;
        })
        .classed('pointer', true);

      // Update the children dot values
      avgs.merge(avgEnter)
        .attr('id', d => d.key)
        .transition(t)
        .attr('cx', d => this.x(d.value.avg))
        .style('fill', d => this.colorScale(Math.log10(d.value.avg)));


      // Mouseover behavior: y-axis
      this.cmpd_names.selectAll('.y-link text')
        .on('mouseover', () => this.showTooltip(d3.event))
        .on('mouseout', () => this.hideTooltip(d3.event));

      // Mouseover behavior: dots
      d3.selectAll('.ac50')
        // syntax via https://stackoverflow.com/questions/42014434/d3-js-passing-a-parameter-to-event-handler
        .on('mouseover', () => this.showTooltip(d3.event))
        .on('mouseout', () => this.hideTooltip(d3.event));

    }
  }

  showTooltip(event) {
    // --- calc variables for tooltip ---
    var x = event.x;
    var y = event.y;

    var cmpd_id = event.currentTarget.id;
    var filtered_data = this.data.filter(d => d.key == cmpd_id)[0];

    // --- highlight the current selection ---
    // dim the rest of the axis
    d3.selectAll(".y-link text")
      .classed("inactive", true);

    // turn off lollipop sticks, circles
    d3.selectAll('.assay-avg')
      .classed("inactive", true)

    d3.selectAll('.lollipop')
      .classed("inactive", true)

    // turn on selected
    d3.selectAll('#' + cmpd_id)
      .classed("active", true)
      .classed("inactive", false);

    // calculate position for the structure
    // NOTE: this *should* go in the compound rollover component for better modularity
    // tell structure to turn on with new info.
    this.tooltipData = { 'on': true, 'data': filtered_data, 'x': this.width - this.struct_width, 'y': 0 };
  }

  hideTooltip(event) {
    // de-highlight everything
    // turn the axis back on
    d3.selectAll(".y-link text")
      .classed("active", false)
      .classed("inactive", false);

    // turn on lollipop sticks, circles
    d3.selectAll(".assay-avg")
      .classed("inactive", false);

    d3.selectAll(".lollipop")
      .classed("inactive", false);

    // tell structure to turn off.
    this.tooltipData = { 'on': false };
  }

}
