/**
 * Created by sebastian on 3/15/17.
 */
import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { GraphDataService } from '../compound-data/indications-graph/indications-graph.component';

// import {jQuery} from 'jquery';
let cytoscape = require('cytoscape');


@Component({
  selector: 'ng2-cytoscape',
  template: '<div id="cy"></div>',
  styles: [`#cy {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }`],

})


export class NgCytoscape implements OnChanges, OnInit {

  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;

  public constructor(private graphDataService: GraphDataService) {
    this.graphDataService.newGraphData$.subscribe(
      data => {
        this.elements = data;
        let cy = cytoscape({ elements: this.elements, container: document.getElementById('cy'),
          style: this.style, zoom: this.zoom, layout: this.layout});



      });


    this.layout = this.layout || {
        name: 'concentric',
        // name: 'random',
        directed: true,
        padding: 0
      };

    this.zoom = this.zoom || {
        min: 0.5,
        max: 1.2
      };


    this.style = this.style || cytoscape.stylesheet()
        .selector('node')
        .css({
          'content': 'data(name)',
          'shape': 'data(faveShape)',
          'text-valign': 'center',
          'background-color': 'data(faveColor)',
          'width': '200px',
          'height': '100px',
          'color': 'black',
          'border-width': 3,
        })
        .selector(':selected')
        .css({
          'border-width': 3,
          'border-color': '#333'
        })
        .selector('edge')
        .css({
          'label': 'data(label)',
          'color': 'black',
          'curve-style': 'bezier',
          'opacity': 0.666,
          'width': 'mapData(strength, 70, 100, 8, 6)',
          'target-arrow-shape': 'triangle',
          'line-color': 'data(faveColor)',
          'source-arrow-color': 'data(faveColor)',
          'target-arrow-color': 'data(faveColor)'
        })
        .selector('edge.questionable')
        .css({
          'line-style': 'dotted',
          'target-arrow-shape': 'diamond'
        })
        .selector('.faded')
        .css({
          'opacity': 0.25,
          'text-opacity': 0
        });


  }

  public ngOnInit(): any {
    // this.render();

    let cy = cytoscape({ elements: this.elements, container: document.getElementById('cy'),
      style: this.style, zoom: this.zoom, layout: this.layout});
    // this.graphDataService.newGraphData$.subscribe(
    //   data => {
    //   this.elements = data;
    // });
    //
    // let cy = cytoscape({ elements: this.elements, container: document.getElementById('cy'),
    //   style: this.style, zoom: this.zoom});
    // // console.log('oasch');
  }

  public ngOnChanges() {
    if(this.elements) {
      console.log('in cy ngonchanges', this.elements);
      let cy = cytoscape({
        elements: this.elements, container: document.getElementById('cy'),
        style: this.style, zoom: this.zoom, layout: this.layout
      });

      // cy.onRender(function(){
      //   console.log('frame rendered');
      // });

      // on click listener draws new node and new edges are generated to new node upon click.
      // the difficulty is to arrange the nodes in a meaningful way. concentric layout might not be the ideal
      // question is how to determine if a node should be positioned relative to the source node.
      cy.on('click', function( event ){
        console.log('tap promise fulfilled');
        console.log(event);
        if(event.cyTarget._private.hasOwnProperty('data')){
          console.log(event.cyTarget._private.data.name);

          cy.add([
            { group: "nodes", data: {id: 'test', name: 'test', faveColor: '#6FB1FC', faveShape: 'rectangle'},
              position: { x: event.cyPosition.x - 20, y: event.cyPosition.y - 50 }},

            { group: "edges", data: {source: event.cyTarget._private.data.id, target: 'test', faveColor: '#42fc49'} }
          ]);


        }

      });

    }
  }

  public test(data): void{
    this.elements = data;
    let cy = cytoscape({ elements: this.elements, container: document.getElementById('cy'),
      style: this.style, zoom: this.zoom});

  }
}
