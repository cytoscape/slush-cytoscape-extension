var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var inquirer = require('inquirer');
var mustache = require("gulp-mustache");
var rename = require('gulp-rename');
var clean = require('gulp-clean');

gulp.task('default', function( next ){
  inquirer.prompt([
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
        { 'value': 'layout', name: 'layout : Adds a layout' },
        { 'value': 'renderer', name: 'renderer : Adds a renderer' }
      ]
    },

    {
      type    : 'input',
      name    : 'description',
      message : 'A one-line description of your extension\n>'
    },

    {
      type    : 'input',
      name    : 'version',
      message : 'Version number',
      default : '1.0.0'
    },

    {
      type    : 'input',
      name    : 'license',
      message : 'License',
      default : 'LGPL-3.0+'
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

    answers.fullName = 'cytoscape-' + answers.name;
    answers.camelName = answers.name.replace(/(-\w)/g, function( v ){
      return v[1].toUpperCase();
    });

    // e.g. answers.layout = true for templating
    answers[ answers.type ] = true;

    gulp.src([
      __dirname + '/templates/**',
      __dirname + '/templates/.gitignore',
      __dirname + '/templates/.npmignore',
      __dirname + '/templates/.spmignore'
    ])  // Note use of __dirname to be relative to generator
      .pipe( mustache(answers) )             // Mustache template support
      .pipe( conflict('./') )                // Confirms overwrites on file conflicts
      .pipe( gulp.dest('./') )               // Without __dirname here = relative to cwd
      .pipe( install() )                     // Run `bower install` and/or `npm install` if necessary
      .on('finish', function(){

        gulp.src('./cytoscape-ext.js')
          .pipe( clean() ) // delete orig file
          .pipe( rename('cytoscape-' + answers.name + '.js') )
          .pipe( gulp.dest('./') )
          .on('finish', function(){
            next();
          })
        ;

      });
  });
});
