// n.b. .layoutPositions() handles all these options for you

const defaults = Object.freeze({
  // animation
  animate: undefined, // whether or not to animate the layout
  animationDuration: undefined, // duration of animation in ms, if enabled
  animationEasing: undefined, // easing of animation, if enabled

  // viewport
  pan: undefined, // pan the graph to the provided position, given as { x, y }
  zoom: undefined, // zoom level as a positive number to set after animation
  fit: undefined, // fit the viewport to the repositioned nodes, overrides pan and zoom

  // modifications
  padding: undefined, // padding around layout
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  spacingFactor: undefined, // a positive value which adjusts spacing between nodes (>1 means greater than usual spacing)

  // layout event callbacks
  ready: function(){}, // on layoutready
  stop: function(){} // on layoutstop
});

class Layout {
  constructor( options ){
    this.options = options;
  }

  run(){
    let layout = this;
    let options = this.options;
    let cy = options.cy;
    let eles = options.eles;
    let nodes = eles.nodes();

    // example positioning algorithm
    let getRandomPos = function( ele, i ){
      return {
        x: Math.round( Math.random() * 100 ),
        y: Math.round( Math.random() * 100 )
      };
    };

    // TODO replace this with your own positioning algorithm
    let getNodePos = getRandomPos;

    // .layoutPositions() automatically handles the layout busywork for you
    nodes.layoutPositions( layout, options, getNodePos );
  }
}

module.exports = Layout;
