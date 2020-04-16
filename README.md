# Svelte Box

<!--<div align="center">
<!-- CodeClimate
<a href="https://codeclimate.com/github/pankod/svelte-boilerplate/maintainability">
<img src="https://api.codeclimate.com/v1/badges/2c6982d3ad672a07f7ae/maintainability" />
</a>
<-- TestCoverage --
<a href="https://codeclimate.com/github/pankod/svelte-boilerplate/test_coverage"><img src="https://api.codeclimate.com/v1/badges/2c6982d3ad672a07f7ae/test_coverage" /></a>
<-- Build Status --
<a href="https://travis-ci.org/pankod/svelte-boilerplate">
<img src="https://travis-ci.org/pankod/svelte-boilerplate.svg?branch=master" alt="Build Status" />
</a>
<-- Dependency Status --
<a href="https://david-dm.org/pankod/svelte-boilerplate">
<img src="https://david-dm.org/pankod/svelte-boilerplate.svg" alt="Dependency Status" />
</a>
<-- devDependency Status --
<a href="https://david-dm.org/pankod/svelte-boilerplate#info=devDependencies">
<img src="https://david-dm.org/pankod/svelte-boilerplate/dev-status.svg" alt="devDependency Status" />
</a>
</div>
-->

<div align="center">
  A template with reasonable defaults and basic layouts to get you on your way 😉.
  <br />
  <sub>Maintained by <a href="https://github.com/k-onrad/">K-onrad</a></sub>
  <br />
  <sub>Inspired by <a href="https://github.com/pankod/svelte-boilerplate">Pankod's boilerplate</a></sub>
</div>

## Why?

[  ] Improve this

Basically, Sapper is awesome, but doesn't attempt to decouple back and front (routing relies on express/polka middleware).
I needed something to give me a decent starting point, with the whole shebang:
* polyfills 
* preprocessors 
* e2e testing 
* SPA, hash-based routing 
* some basic layouts
But completely decoupled from a back-end.
Obviously I still 🔥❤️️ Svelte , so I couldn't abandon it because of scaffolding. I ended up forking something and messing around with it.

## What's in the box?

This template includes:
* **[Svelte](https://svelte.dev/)** - Component framework which compiles your code to tiny, framework-less vanilla JS.
* **[Rollup](https://rollupjs.org/guide/en/)** - Next-generation ES module bundler.
* **[Babel](https://babeljs.io/)** -  Babel is a compiler for writing next generation JavaScript.
* **[Core-JS](https://github.com/zloirock/core-js)** - Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2020.
* **[Svelte-preprocess](https://github.com/kaisermann/svelte-preprocess)** - SASS/SCSS (and other stuff) preprocessor for svelte.
* **[PostCSS](https://postcss.org/)** - A tool for transforming styles with JS plugins.
* **[Svelte-SPA-Router](https://github.com/ItalyPaleAle/svelte-spa-router)** - Router for SPAs using Svelte 3.
* **[Cypress](https://www.cypress.io/)** - Javascript e2e testing framework.
* **[ESLint](https://eslint.org/)-[Standard](https://standardjs.com/)** - An ESLint shareable Config for JavaScript Standard Style.
* **[Isomorphic Fetch](https://github.com/matthew-andrews/isomorphic-fetch)** - Isomorphic WHATWG Fetch API, for Node & Browserify.

And layouts? Yes, layouts. Be advised we componentized and messed around with them a little bit.
* **[Shards Dashboard](https://github.com/designrevision/shards-dashboard)** - A modern & free Bootstrap 4 admin dashboard template pack.
* [  ] something blog-like
* [  ] something store-like

## Setting up shop

[  ] Write this whole thing


## Where does everything go

### For the bureaucrats

Licensed under the MIT License, Copyright © 2019-present K-onrad
