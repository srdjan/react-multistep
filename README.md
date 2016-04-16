# Responsive ReactJS multi step form component
## ES6, React 15.0.1, babel 6, Browserify

[![version](https://img.shields.io/npm/v/npm-install-loader.svg)](http://npm.im/react-multistep)
[![downloads](https://img.shields.io/npm/dm/npm-install-loader.svg)](http://npm-stat.com/charts.html?package=react-multistep)
[![MIT License](https://img.shields.io/npm/l/npm-install-loader.svg)](http://opensource.org/licenses/MIT)


[Working demo](https://dl.dropboxusercontent.com/u/51491957/multistep/index.html)

[List of forks] (https://github.com/srdjan/react-multistep/network/members)

# DELTA with original:

* Added `initialStep` property so you can use it to _ask_ the component to browse from its parent component
* Added `handleKeyDown` property flag to disable steps completion & browsing upon hitting enter key

## Instructions

To install this module run:
```sh
npm install react-multistep
```
next, require it inside of your app:
```sh
var Multistep = require('react-multistep').Multistep
```

To build included example:
```sh
npm run build
```
Now open ./example/index.html in your favorite browser


## Dev instructions

First clone the repository and then run:
```sh
npm install
```

To test run:
```sh
npm test
```
