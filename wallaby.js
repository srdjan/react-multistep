var wallabify = require('wallabify');
var wallabyPostprocessor = wallabify({
    // browserify options, such as
    // insertGlobals: false
  }
  // you may also pass an initializer function to chain other 
  // browserify options, such as transformers
  // , b => b.exclude('mkdirp').transform(require('babelify'))
);

module.exports = function () {
  return {
    // set `load: false` to all of the browserified source files and tests,
    // as they should not be loaded in browser, 
    // their browserified versions will be loaded instead
    files: [
      {pattern: 'src/*.js', load: false}
    ],

    tests: [
      {pattern: 'test/*Spec.js', load: false}
    ],

    postprocessor: wallabyPostprocessor,

    bootstrap: function () {
      // required to trigger tests loading 
      window.__moduleBundler.loadTests();
    }
  };
};