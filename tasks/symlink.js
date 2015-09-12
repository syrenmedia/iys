'use strict';

var
  path = require( 'path' ),
  util = require( 'util' ),
  config = require( '../package.json' ).config,
  chalk = require( 'chalk' ),
  shell = require( 'shelljs' ),
  sourceDir = config.sourceDir,
  buildDir = config.buildDir,
  symlinkExpression = config.symlinkExpression,
  copyInsteadOfLink = process.argv.some( function( arg ) { return arg.match( /^copy$/ ); }),
  findFilesInDir,
  symlinkFile,
  copyFile,
  filesToLink;

// could cause problems
chalk.enabled = true;

findFilesInDir = function( dir ) {
  return shell.find( dir ).filter( function( fileName ) {
    return fileName.match( symlinkExpression );
  });
};

symlinkFile = function( source, dest ) {
  util.log( 'making symlink from: ' + chalk.cyan( source ) + ' to: ' + chalk.magenta( dest ));
  return shell.ln( '-s', source, dest );
};

copyFile = function( source, dest ) {
  util.log( 'making copy from: ' + chalk.cyan( source ) + ' to: ' + chalk.magenta( dest ));
  return shell.cp( source, dest );
};

filesToLink = findFilesInDir( 'src' );
util.log(
  ( copyInsteadOfLink ? 'copying' : 'linking' ) + ' files: ',
  filesToLink
);

findFilesInDir( sourceDir ).forEach( function( fileName ) {
  var destFileName = fileName.replace( sourceDir, buildDir ),
    folder = path.dirname( destFileName );

  /*
  util.log({
    fileName: fileName,
    destFileName: destFileName,
    folder: folder
  });
  */

  if ( !shell.test( '-d', folder )) {
    shell.mkdir( '-p', folder );
    util.log( 'creating folder: ' + chalk.magenta( folder ));
  }

  if ( copyInsteadOfLink ) {
    copyFile( fileName, fileName.replace( sourceDir, buildDir ));
  } else {
    symlinkFile( fileName, fileName.replace( sourceDir, buildDir ));
  }
});

util.log( chalk.green( 'symlinking done' ));