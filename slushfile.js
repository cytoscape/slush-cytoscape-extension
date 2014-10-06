var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var inquirer = require('inquirer');
var mustache = require("gulp-mustache");
var reanem = require('gulp-rename');

gulp.task('default', function( next ){
  inquirer.prompt([
    {
      type    : 'input',
      name    : 'name',
      message : 'Your extension name (e.g. for cytoscape-myextension write "myextension")'
    },

    {
      type    : 'input',
      name    : 'githubProj',
      message : 'Github project name (e.g. org/cytoscape-myextension)'
    },

    {
      type    : 'input',
      name    : 'description',
      message : 'A one-line description of your extension'
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
      default : 'LGPL3+'
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

    gulp.src( __dirname + '/templates/**' )  // Note use of __dirname to be relative to generator
      .pipe( mustache(answers) )             // Mustache template support
      .pipe( conflict('./') )                // Confirms overwrites on file conflicts
      .pipe( gulp.dest('./') )               // Without __dirname here = relative to cwd
      .pipe( install() )                     // Run `bower install` and/or `npm install` if necessary
      .on('finish', function(){
        
        gulp.src('./cytoscape-ext.js')
          .pipe( rename('cytoscape-' + answers.name + '.js') )
          .pipe( gulp.dest('./') )
          .on('finish', function(){
            next();
          })
        ;

      });
  });
});