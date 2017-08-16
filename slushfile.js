var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var inquirer = require('inquirer');
var mustache = require("gulp-mustache");
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var path = require('path');
var filter = require('gulp-filter');

gulp.task('default', function( next ){
  inquirer.prompt([
    {
      type    : 'input',
      name    : 'author',
      message : 'The name of the author or organisation\n>'
    },

    {
      type    : 'input',
      name    : 'name',
      message : 'Your extension name (e.g. for cytoscape-my-extension write "my-extension")\n>'
    },

    {
      type    : 'input',
      name    : 'githubProj',
      message : 'Github project name (e.g. org/cytoscape-my-extension)\n>'
    },

    {
      type    : 'list',
      name    : 'type',
      message : 'Extension type',
      choices : [
        { 'value': 'core', name: 'core : Adds a function to the core (graph)' },
        { 'value': 'collection', name: 'collection : Adds a function to collections (nodes/edges)' },
        { 'value': 'layout', name: 'layout : Adds a layout' }
        //{ 'value': 'renderer', name: 'renderer : Adds a renderer' }
      ]
    },

    // {
    //   type    : 'list',
    //   name    : 'layoutType',
    //   message : 'Layout type',
    //   choices : [
    //     { 'value': 'dicrete', name: 'Dicrete : Immediately sets end positions based on a function' },
    //     { 'value': 'continuous', name: 'Continuous : Sets positions based on multiple iterations (e.g. force-directed)' }
    //   ],
    //   when: function( answers ){
    //     return answers.type === 'layout';
    //   }
    // },

    {
      type    : 'input',
      name    : 'description',
      message : 'A one-line description of your extension\n>'
    },

    {
      type    : 'input',
      name    : 'cyVersion',
      message : 'Compatible Cytoscape.js semver',
      default : '^3.2.0'
    },

    {
      type    : 'input',
      name    : 'license',
      message : 'License',
      default : 'MIT'
    },

    {
      type    : 'confirm',
      name    : 'moveon',
      message : 'Create extension with above options?'
    }
  ],
  function( answers ){
    if( !answers.moveon ){
      return next();
    }

    answers.version = '0.0.0';

    answers.fullName = 'cytoscape-' + answers.name;
    answers.camelName = answers.name.replace(/(-\w)/g, function( v ){
      return v[1].toUpperCase();
    });

    // e.g. answers.layout = true for templating
    answers[ answers.type ] = true;

    // answers.continuous = answers.layout && answers.layoutType === 'continuous';
    // answers.dicrete = answers.layout && answers.layoutType === 'dicrete';

    var srcs = [
      __dirname + '/templates/*',
      __dirname + '/templates/test/**',
      __dirname + '/templates/src/*',
      __dirname + '/templates/.*'
    ];

    if( answers.layout ){
      srcs.push( __dirname + '/templates/src/layout/**' );
    } else if( answers.collection ){
      srcs.push( __dirname + '/templates/src/collection/**' );
    } else if( answers.core ){
      srcs.push( __dirname + '/templates/src/core/**' );
    }

    gulp.src( srcs, { base: __dirname + '/templates', nodir: true } )
      .pipe( mustache(answers) )              // Mustache template support
      .pipe( conflict('./') )                 // Confirms overwrites on file conflicts
      .pipe( gulp.dest('./') )                // Without __dirname here = relative to cwd
      .pipe( filter(['**', '!*bower.json']) ) // Don't bower install
      .pipe( install() )                      // Run `npm install` if necessary
      .on('finish', function(){
        next();
      });
  });
});
