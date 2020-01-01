import { commitRoot } from './commitQueue';
import { diff } from '../diff';
import { assign } from '../utils/obj';
import { getDOMSibling, updateParentDomPointers } from './dom';
import options from '../options';
import { EMPTY_OBJ, EMPTY_ARR } from '../utils/constants'
import { createElement, Fragment } from '../create-element';

const IS_HYDRATE = EMPTY_OBJ;

/** TODO.
 * trigger in-place re-rendering of a component.
 * @param component the component to rerender
 */
export const renderComponent = (component) => {
  let vnode = component._vnode, oldDom = vnode._dom, parentDom = component._parentDom;
  if (parentDom) {
    let commitQueue = [];
    let newDom = diff(
      parentDom,
      vnode,
      assign({}, vnode),
      component._context,
      parentDom.ownerSVGElement !== undefined,
      null,
      commitQueue,
      oldDom === null ? getDOMSibling(vnode) : oldDom
    );
    commitRoot(commitQueue, vnode);
  }

  if (newDom !== oldDom) {
    updateParentDomPointers(vnode);
  }
}

/**
 * render a virtual node into a DOM element. UPDATE SOURCE CODE.
 * @param vnode virtual node to render
 * @param parentDom the dom element to render into
 * @param replaceNode attempt to re-use an existing DOM tree rooted at `replaceNode`
 */
export const render = (vnode, parentDom, replaceNode) => {
  if (options._root) options._root(vnode, parentDom);
  let isHydrating = replaceNode === IS_HYDRATE;
  let oldVNode;
  if (isHydrating) {
    oldVNode = (replaceNode && replaceNode._children) || parentDom._children;
    parentDom._children = vnode;
  } else {
    oldVNode = null;
    if (replaceNode) {
      replaceNode._children = vnode;
    } else {
      parentDom._children = vnode;
    }
  }

  // TODO???
  console.log('called')
  vnode = createElement(Fragment, null, [vnode]);
  console.log('vnode', vnode)

  let commitQueue = [];
  const isSvg = parentDom.ownerSVGElement !== undefined;

  let excessDomChildren;
  if (replaceNode && !isHydrating) {
    excessDomChildren = [replaceNode]
  } else {
    excessDomChildren = oldVNode ? null : EMPTY_ARR.slice.call(parentDom.childNodes);
  }

  const oldDom = replaceNode || EMPTY_OBJ;

  // UPDATE SOURCE CODE.
  diff(
    parentDom,
    vnode,
    oldVNode || EMPTY_OBJ,
    EMPTY_OBJ,
    isSvg,
    excessDomChildren,
    commitQueue,
    oldDom,
    isHydrating,
  );

  commitRoot(commitQueue, vnode);
}

/**
 * update an existing DOM element with data from a virtual node
 * @param vnode the virtual node to render
 * @param parentDom the DOM element to update
 */
export const hydrate = (vnode, parentDom) => {
  render(vnode, parentDom, IS_HYDRATE);
}