//main.js

/*
Read in CLI arguments
 */

 var ArgumentParser = require('argparse').ArgumentParser;
  var parser = new ArgumentParser({ addHelp: true, description: 'Format to JUnit Options' });
  parser.addArgument([ '-f', '--from' ],{ help: 'Path to file to format' });
  parser.addArgument([ '-t', '--to' ], {help: 'Path to where the XML file should write'});
  var args = parser.parseArgs();

/*
Main
*/

(function(){
  console.log(args.from);
  console.log(args.to);
  console.log('css-lint application');
}).call(this);