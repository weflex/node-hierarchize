# hierarchize(1)

> hierarchize the node_modules distribution of your project

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![Downloads][downloads-image]][downloads-url]

## Why this tool

The npm3 would do flat the node_modules and doesnt support nested feature 
as the [issue#9809](https://github.com/npm/npm/issues/9809):

> @othiym23: If you want nested modules on disk, you can use npm@2, which 
> is in LTS mode now, and will continue to receive support for critical issues, 
> security fixes, backwards-compatible dependency updates, and registry 
> compatibility for probably about as long as it's being included in Node LTS 
> releases.

But the ugly flatten tree does make tracing your dependencies be very hard when
you were to debug some of them. Hence that WeFlex team builds this tool to
generate the [npm-shrinkwrap.json](./npm-shrinkwrap.json) from the [package.json](./package.json)
of your project.

Enjoy this tool by yourself :)

## Usage

```txt

hierarchize(1) - hierarchize the node_modules distribution in your project

Usage:

  hierarchize [project path]

Options:

  -d | --dev        : contains devDependencies
  -h | -? | --help  : print help

```

Here we have an example command for starting user:

```sh
$ hierarchize ./  # hierarchize the current project
$ hierarchize ./path/to/your/other/project # hierarchize specific project
$ rm -rf node_modules && npm install
```

For more human readablity and usage, we still symlink a command named: `nest-your-node-modules` which
is an alias for `hierarchize`.

## Installation

```sh
$ npm install hierarchize -g
```

## License

MIT Licensed @ WeFlex, Org.

[npm-image]: https://img.shields.io/npm/v/hierarchize.svg?style=flat-square
[npm-url]: https://npmjs.org/package/hierarchize
[travis-image]: https://img.shields.io/travis/weflex/node-hierarchize.svg?style=flat-square
[travis-url]: https://travis-ci.org/weflex/node-hierarchize
[david-image]: http://img.shields.io/david/weflex/node-hierarchize.svg?style=flat-square
[david-url]: https://david-dm.org/weflex/node-hierarchize
[downloads-image]: http://img.shields.io/npm/dm/hierarchize.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/hierarchize
