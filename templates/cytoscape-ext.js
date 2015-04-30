;(function(){ 'use strict';

  // registers the extension on a cytoscape lib ref
  var register = function( cytoscape ){
    if( !cytoscape ){ return; } // can't register if cytoscape unspecified
    
    var $$ = cytoscape;

    var defaults = {
      // define the default options for your ext here (if you use options)
    };

    // if you want a collection extension
    cytoscape('collection', '{{name}}', function( options ){ // could use options object, but args are up to you
      options = $$.util.extend({}, defaults, options);
      
      var eles = this;
      var cy = this.cy();
      
      // your extension impl...

      return this; // chainability
    });

    // if you want a core extension
    cytoscape('core', '{{name}}', function( options ){ // could use options object, but args are up to you
      options = $$.util.extend({}, defaults, options);
      
      var cy = this;

      // your extension impl...

      return this; // chainability
    });
    
    // if you want a layout  
    function Layout( options ){
      this.options = $$.util.extend({}, defaults, options);
    }
    
    Layout.prototype.run = function(){
      var options = this.options;
      var cy = options.cy;
      var eles = options.eles;
      
      // run layout on eles...
      
      // example simple, synchronous layout : https://github.com/cytoscape/cytoscape.js/blob/master/src/extensions/layout.grid.js
      // example async layout : https://github.com/cytoscape/cytoscape.js/blob/master/src/extensions/layout.cola.js
    };
    
    cytoscape('layout', '{{name}}', Layout);

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
