<h1 align="center">Svelte Box</h1>

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

* [ ] Improve this

Basically, Sapper is awesome, but doesn't attempt to decouple back and front (routing relies on express/polka middleware).

I needed something to give me a decent starting point, with the whole shebang:
* polyfills
* preprocessors
* e2e testing
* hash-based routing
* some basic layouts

But completely decoupled from a back-end.

Obviously I still 🔥❤️️ Svelte , so I couldn't abandon it because of scaffolding.

I ended up forking something and messing around with it. Replaced some pieces that needed precise config to work properly, and here we are now!

## What's in the box?

This template includes:
* **[Svelte](https://svelte.dev/)** - Cybernetically enhanced web apps.
* **[Rollup](https://rollupjs.org/guide/en/)** - Next-generation ES module bundler.
* **[Babel](https://babeljs.io/)** -  Babel is a compiler for writing next generation JavaScript.
* **[Core-JS](https://github.com/zloirock/core-js)** - Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2020.
* **[Svelte-preprocess](https://github.com/kaisermann/svelte-preprocess)** - SASS/SCSS (and other stuff) preprocessor for svelte.
* **[PostCSS](https://postcss.org/)** - A tool for transforming styles with JS plugins.
* **[Svelte-SPA-Router](https://github.com/ItalyPaleAle/svelte-spa-router)** - Router for SPAs using Svelte 3.
* **[Cypress](https://www.cypress.io/)** - Javascript e2e testing framework.
* **[ESLint](https://eslint.org/)** - Finds and fixes problems in your JavaScript code (already configured for Svelte etc).

And layouts? Yes, layouts. Be advised we componentized and messed around with them a little bit.
* **Dashboard** - A modern dashboard, inspired by [Shards Dashboard](https://github.com/designrevision/shards-dashboard).
* **Blog** - [ ] something blog-like
* **Store** - [ ] something store-like

## Setting up shop

`npx degit k-onrad/svelte-box my-svelte-project`

`cd my-svelte-project`

`npm i`

* [ ] Details? Dunno

## Where does everything go

* [ ] Write this too

---

#### For the bureaucrats

<sub>Licensed under the MIT License, Copyright © 2019-present K-onrad</sub>
