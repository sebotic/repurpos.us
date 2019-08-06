import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import * as d3 from 'd3';

import { ColorPaletteService } from '../../_services';

@Component({
  selector: 'app-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TreemapComponent implements OnInit {
  @ViewChild('treemap') private chartContainer: ElementRef;
  @Input() data: string[];
  @Input() colorScale: any;

  hierarchy: any;

  // plot sizes
  private element: any;
  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  private width: number = 150;
  private height: number = 150;

  // constants
  private tooltip_frac: number = 1;
  private legend_threshold: number = 6; // how many of the indications to include in the treemap annotation.  Used b/c there are just too many assays...

  // --- Selectors ---
  private chart: any;
  private tooltips: any;
  private treemap: any; // function for treemap generation

  constructor(private assaySvc: ColorPaletteService) {
  }

  ngOnInit() {
    this.createChart();
    this.drawChart();
  }

  ngOnChanges() {
    this.drawChart();
  }

  // Nest and hierarchical-ize.
  prepData() {
    let nested = d3.nest()
      .key((d: any) => d)
      .rollup((leaves: any) => leaves.length)
      .entries(this.data)
      .sort((a: any, b: any) => b.value - a.value || a.key - b.key);

    // Need to have a root object for the hierarchy to relate to
    // Creating a dummy "parent root"
    let nested_root = [{ key: "parent", parent: "", value: 0 }];

    nested.forEach(d => {
      nested_root.push({ key: d.key, value: d.value, parent: "parent" })
    })

    // Stratifying data into a one-layer hierarchy for treemap.
    this.hierarchy = d3.stratify()
      .id((d: any) => d.key)
      .parentId((d: any) => d.parent)(nested_root)
      .sum((d: any) => d.value);
  }

  createChart() {
    this.element = this.chartContainer.nativeElement;
    let dims = this.element.getBoundingClientRect();

    this.chart = d3.select(this.element)
      .append('svg')
      .attr("class", "treemap")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.tooltips = d3.select("body")
      .append("div")
      .attr("id", "annotations")
      // .style("top", dims.top  + (this.height * (1-this.tooltip_frac))/2 + "px")
      // .style("left", (dims.left + (this.width * (1-this.tooltip_frac))/2 - 55) + "px") // hack-- not sure why there's a 55 px offset...
      .attr("id", "annotations")
      .style("top", dims.top + this.height + "px")
      .style("right", "435px") // hack-- not sure why there's an offset...
      .style("width", (this.width * this.tooltip_frac) + "px");
    // .style("height", (this.height * this.tooltip_frac) + "px");

    this.treemap = data => d3.treemap()
      .tile(d3.treemapBinary)
      .size([this.width, this.height])
      .padding(1)
      .round(true)
      (d3.hierarchy(data)
        .sort((a, b) => b.value - a.value))
  }

  drawChart() {
    this.prepData();

    if (this.element) {
      // --- treemap ---
      const root = this.treemap(this.hierarchy);

      const leaf = this.chart.selectAll("g")
        .data(root.leaves());

      const leafRect = leaf.select(".treemap--rect");

      leaf.exit().remove();

      let leafEnter = leaf
        .enter().append("g");

      let leafRectEnter =
        leafEnter.append("rect")
          .attr("class", (d: any, i: number) => i < this.legend_threshold ? "treemap--rect" : "treemap--rect other")

      leaf.merge(leafEnter)
        .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);

      leafRect.merge(leafRectEnter)
        .attr("id", (d: any) => this.cleanIDs(d.data.data.key))
        .transition()
        .attr("fill", (d: any) => this.colorScale(d.data.data.key))
        .duration(1000)
        .attr("width", (d: any) => d.x1 - d.x0)
        .attr("height", (d: any) => d.y1 - d.y0);

      // --- legend ---
      const legend = d3.select("#treemap-legend");

      // if (this.hierarchy.children) {
      let data4legend = this.hierarchy.children ? this.hierarchy.children : [];
      const legend_data = legend.selectAll(".legend--name")
        .data(data4legend);

      legend_data.exit().remove();

      let legendEnter = legend_data
        .enter()
        .append("div")

        .attr("class", "legend--name")
        .style("max-width", this.width + "px")

      let legend_threshold = this.legend_threshold;

      legend_data.merge(legendEnter)
        .select(function(d, idx) { return idx < legend_threshold ? this : null })
        .attr("id", (d: any) => this.cleanIDs(d.id))
        .style("color", (d: any) => this.colorScale(d.id))
        .text((d: any, i: number) => i === 0 ? `${d.id} (${d.value} assays)` : `${d.id} (${d.value})`);

      let other_sum = d3.sum(data4legend
        .filter((d, idx) => idx >= this.legend_threshold)
        .map(d => d.value));

      if (other_sum > 0) {
        legend.append("div")
          .attr("class", "legend--name legend--other")
          .attr("id", "other")
          .text(`other (${other_sum})`);
      }
      
      // --- tooltips ---
      let annotations = this.tooltips
        .selectAll(".treemap--annotation")
        .data(root.leaves())
        .enter().append("div")
        .attr("class", "treemap--tooltip")
        .attr("id", (d: any) => this.cleanIDs(d.data.data.key))
        // .style("background", (d: any) => this.colorScale(d.data.data.key))
        .style("background", "white")
        .style("width", (this.width * this.tooltip_frac) + "px")
        // .style("height", (this.height * this.tooltip_frac) + "px")
        .style("opacity", 0);

      annotations.append("div")
        .attr("class", "tooltip--label")
        .style("color", (d: any) => this.colorScale(d.data.data.key))
        .html((d: any) => `${d.data.data.key}`);

      annotations
        .append("div")
        .attr("class", "tooltip--value")
        .html((d: any) => `${d.data.data.value} ${d.data.data.value === 1 ? "assay" : "assays"}`);

      d3.selectAll(".treemap--rect")
        .on("mouseover", () => this.showTooltip(d3.event))
        .on("mouseout", () => this.hideTooltip())
        .on("click", (data: any) => {
          this.hideTooltip();
          this.assaySvc.selectedIndicationSubject.next(data.data.id);
        })
    }
  }

  showTooltip(event) {
    let selected_id = event.currentTarget['id'];

    // turn off others
    d3.selectAll(".legend--name")
      .style("opacity", 0.25);

    d3.selectAll(".treemap--rect")
      .style("opacity", 0.25);

    // turn on selected
    d3.selectAll("#" + selected_id)
      .style("opacity", 0.95);

    if (event.currentTarget['className'].baseVal === "treemap--rect other") {
      d3.selectAll("#other")
        .style("opacity", 0.95);
    }
  }



  hideTooltip() {
    d3.selectAll(".treemap--tooltip")
      .style("opacity", 0);

    d3.selectAll(".legend--name")
      .style("opacity", 1);

    d3.selectAll(".treemap--rect")
      .style("opacity", 1);
  }

  filterIndication() {

  }

  // Get an ID worthy of being attr #id
  cleanIDs(id) {
    return (id.replace(/\./g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/\:/g, "").replace(/ /g, "-"))
  }


}
