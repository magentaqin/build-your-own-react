import { applyRef } from '../utils/ref';
import options from '../options';
import { removeNode } from '../render/dom';

/**
 * unmount a virtual node from the tree and apply DOM changes
 * @param vnode the virtual node to unmount
 * @param parentVNode parent virtual node
 * @param skipRemove flag that indicates that a parent node of the current element is already detached from the DOM.
 */
export const unmount = (vnode, parentVNode, skipRemove) => {
  let r;
  if (options.unmount) options.unmount(vnode);

  if (vnode && vnode.ref) {
    r = vnode.ref;
    applyRef(r, null, parentVNode);
  }

  // UPDATE SOURCE CODE
  let dom;
  if (!skipRemove && vnode && typeof vnode.type !== 'function') {
    dom = vnode._dom;
    if (dom !== null) {
      skipRemove = true;
    }
  }

  if (vnode) {
    vnode._lastDomChild = null;
    vnode._dom = null;
    r = vnode._component;
  }

  if (r) {
    if (r.componentWillUnmount) {
      try {
        r.componentWillUnmount();
      } catch (e) {
        options._catchError(e, parentVNode);
      }
    }

    r._parentDom = null;
    r.base = r._parentDom;
  }

  // recursively unmount children
  if (vnode) {
    r = vnode._children;
    if (r) {
      for (let i = 0; i < r.length; i++) {
        if (r[i]) unmount(r[i], parentVNode, skipRemove);
      }
    }
  }

  // remove dom node
  if (dom !== null) removeNode(dom);
}