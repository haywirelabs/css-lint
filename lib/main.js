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
  Set up XML Document
   */

  var docBuilder = require('xmlbuilder');
  var xml = docBuilder.create('testsuite', {version: '1.0', encoding: 'UTF-8'}, {errors: '0', 'tests':'0'});
  xml.att('errors', '0');
  xml.att('tests','0');
  xml.att('time','0');
  xml.att('failures', '0');
  xml.att('name', 'CSSLint Results');

  var xmlProperty = xml.ele('properties')
  .att('value','Java(TM) 2 Runtime Environment, Standard Edition')
  .att('name','java.runtime.name')
    .ele('property')
    .att('value', 'UnicodeBig')
    .att('name', 'sun.io.unicode.encoding');

/*
Main
*/

(function(){

  var fileToFormat = args.from;
  var xml2js = require('xml2js');
  var fs = require('graceful-fs');
  var parser = new xml2js.Parser();
  var issueCounter = 1;

  var contents = fs.readFileSync(fileToFormat).toString();
  parser.parseString(contents, function(err, result){

    for(var i = 0; i < result.lint.file.length; i++){
      if(result.lint.file[i]){
        var fileName = result.lint.file[i].$.name;
        for(var j = 0; j < result.lint.file[i].issue.length; j++){
          if(result.lint.file[i].issue[j].$.severity === 'error'){
            var errorName = 'error' + issueCounter;
            var errorLine = 'Line: ' + result.lint.file[i].issue[j].$.line;
            var errorChar = 'Char:' + result.lint.file[i].issue[j].$.char;
            var errorSeverity = result.lint.file[i].issue[j].$.severity;
            var errorReason = result.lint.file[i].issue[j].$.reason;

            var xmlTestCase = xml.ele('testcase')
              .att('time', '0')
              .att('name', errorName)
              .ele('failure',{'type':'junit.framework.AssertionFailedError', 'message': errorSeverity}, errorReason + ' on ' + fileName + errorLine + errorChar);

            issueCounter++;
          }
        }
      }
    }

  });

  xmlString = xml.end();
  var writeStream = fs.createWriteStream(args.to);
  writeStream.write(xmlString);
  writeStream.end = function(data){
    console.log('Done Writing');
  };

  console.log('CSS Lint Transform Complete');

}).call(this);