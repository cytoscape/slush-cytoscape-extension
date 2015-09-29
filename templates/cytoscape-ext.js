;(function(){ 'use strict';

  // registers the extension on a cytoscape lib ref
  var register = function( cytoscape ){

    if( !cytoscape ){ return; } // can't register if cytoscape unspecified
    {{#collection}}

    cytoscape( 'collection', '{{name}}', function(){
      var eles = this;
      var cy = this.cy();

      // your extension impl...

      return this; // chainability
    } );

    {{/collection}}
    {{#core}}

    cytoscape( 'core', '{{name}}', function(){
      var cy = this;

      // your extension impl...

      return this; // chainability
    } );

    {{/core}}
    {{#layout}}

    var defaults = {
      // define the default options for your layout here
    };

    var extend = Object.assign || function( tgt ){
      for( var i = 1; i < arguments.length; i++ ){
        var obj = arguments[i];

        for( var k in obj ){ tgt[k] = obj[k]; }
      }

      return tgt;
    };

    function Layout( options ){
      this.options = extend( {}, defaults, options );
    }

    Layout.prototype.run = function(){
      var layout = this;
      var options = this.options;
      var cy = options.cy;
      var eles = options.eles;

      var getRandomPos = function( i, ele ){
        return {
          x: Math.round( Math.random() * 100 ),
          y: Math.round( Math.random() * 100 )
        };
      };

      // dicrete/synchronous layouts can just use this helper and all the
      // busywork is handled for you, including std opts:
      // - fit
      // - padding
      // - animate
      // - animationDuration
      // - animationEasing
      eles.layoutPositions( layout, options, getRandomPos );

      return this; // or...

      // continuous/asynchronous layout need to do things manually:
      // (this is shown syncronously for simplicity but you'd probably
      // use a thread or two)

      // to indicate we've started
      layout.trigger('layoutstart');

      // then we set initial node positions using ele.position(),
      // eles.positions(), etc
      eles.nodes().positions(function( i, ele ){
        return { x: 0, y: 0 };
      });

      cy.fit(); // maybe we fit on each step

      // to indicate all nodes have their initial positions set
      layout.trigger('layoutready');

      // then we calculate for a while to get the final positions
      for( var i = 0; i < 10; i++ ){
        eles.positions( getRandomPos );

        cy.fit(); // maybe we fit on each step
      }

      // to indicate we've stopped
      layout.trigger('layoutstop');

      return this;
    };

    Layout.prototype.stop = function(){
      // continuous/asynchronous layout may want to set a flag etc to let
      // run() know to stop
    };

    Layout.prototype.destroy = function(){
      // clean up here if you create threads etc
    };

    cytoscape( 'layout', '{{name}}', Layout );

    {{/layout}}
    {{#renderer}}

      // TODO renderer

    {{/renderer}}
  };

  if( typeof module !== 'undefined' && module.exports ){ // expose as a commonjs module
    module.exports = register;
  }

  if( typeof define !== 'undefined' && define.amd ){ // expose as an amd/requirejs module
    define('{{fullName}}', function(){
      return register;
    });
  }

  if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
    register( cytoscape );
  }

})();
