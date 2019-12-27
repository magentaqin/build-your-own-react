import options from '../options';
import { renderComponent } from './render';

// the render queue.
const q = [];

// TODO. DO NOT KNOW WHY.
let prevDebounce;

// BROWSER COMPATIBLE WORK. https://caniuse.com/#search=promise
const defer = typeof Promise === 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

/**
 * enqueue a rerender of a component
 * @param c component which is to rerender
 */
export const enqueueRender = (c) => {
  // TODO. _dirty role???
  if (!c._dirty) {
    c._dirty = true;
    q.push(c);
    if (q.length === 1 && prevDebounce !== options.debounceRendering) {
      prevDebounce = options.debounceRendering;

      // TODO
      (prevDebounce || defer)(processQueue);
    }
  }
}

// flush the render queue by rerendering all queued components
const processQueue = () => {
  let c;

  // descend sort
  q.sort((a,b) => b._vnode._depth - a._vnode._depth);

  // UPDATE SOURCE CODE.
  q.forEach(item => {
    c = q.pop();
    if (c._dirty) renderComponent(p);
  })

}