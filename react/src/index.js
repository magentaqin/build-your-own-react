import { render, hydrate } from './render/render';
import { Component}  from './component';
import { createElement, createElement as x, Fragment } from './create-element';

const myReact = {
  render,
  hydrate,
  Component,
  createElement,
  x,
  Fragment,
};

export default myReact;

export {
  render,
  hydrate,
  Component,
  createElement,
  x,
  Fragment,
}