import { createVNode } from '../create-element';
import { EMPTY_OBJ, EMPTY_ARR } from '../utils/constants';
import { removeNode, unmount } from '../utils/node';
import { getDOMSibling } from '../render/dom';
import { diff } from './index';
import { applyRef } from '../utils/ref';

/**
 * flatten the children of a virtual node.UPDATE SOURCE CODE.
 *
 * @param children unflattened children of a virtual node
 * @param callback a function to invoke for each child before it is added to the flattened list.
 * @param flattened an array that stores flattened children
 */
export const toChildArray = (children, callback, flattened) => {
  if (flattened === null) flattened = [];

  if (children === null || typeof children === 'boolean') {
    if (callback) {
      flattened.push(callback(null));
    }
    return flattened;
  }

  // flatten nested children.
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      toChildArray(children[i], callback, flattened);
    }
    return flattened;
  }

  if (!callback) {
    flattened.push(children);
    return flattened;
  }

  if (typeof children === 'string' || typeof children === 'number') {
    flattened.push(callback(createVNode(null, children, null, null)))
    return flattened;
  }

  if (children._dom !== null || children._component !== null) {
    flattened.push(callback(createVNode(children.type, children.props, children.key, null)));
    return flattened;
  }

  flattened.push(callback(children));
  return flattened;
}

/**
 * invoke for each child before it is added to the flattened list
 *
 * @param {*} childVNode child virtual node.
 */
export const transformBeforeFlatten = (data, i) => (childVNode) => {
  let { newParentVNode, oldVNode, oldChildrenLength, newDom } = data;
  let j;
  if (childVNode !== null) {
    childVNode._parent = newParentVNode;
    childVNode._depth = newParentVNode._depth + 1;

    // if we find the same vnode(compare key and type) in oldChildren. delete it by setting it to `undefined`.
    oldVNode = oldChildren[i];
    if (oldVNode === null || (oldVNode && childVNode.key === oldVNode.key && childVNode.type === oldVNode.type)) {
      oldChildren[i] = undefined;
    } else {
      for (j = 0; j < oldChildrenLength; j++) {
        oldVNode = oldChildren[j];
        if (oldVNode && childVNode.key === oldVNode.key && childVNode.type === oldVNode.type) {
          oldChildren[j] = undefined;
          break;
        }
        oldVNode = null;
      }
    }

    oldVNode = oldVNode || EMPTY_OBJ;

    const { parentDom, context, isSvg, excessDomChildren, commitQueue, oldDom, isHydrating, firstChildDom, refs } = data;
    // TODO.morgh the old element into the new one. but don't append it to the dom.
    newDom = diff(
      parentDom,
      childVNode,
      oldVNode,
      context,
      isSvg,
      excessDomChildren,
      commitQueue,
      oldDom,
      isHydrating
    )

    if ((j = childVNode.ref) && oldVNode.ref !== j) {
      if (!refs) refs = [];
      if (oldVNode.ref) {
        refs.push(oldVNode.ref, null, childVNode);
      }
      refs.push(j, childVNode._component || newDom, childVNode);
    }

    // only proceed if the vnode has not been unmounted by `diff()` above
    if (newDom !== null) {
      if (firstChildDom === null) {
        firstChildDom = newDom;
      }

      // only components that return Fragment like VNodes will have a non-null _lastDOMChild.
      if (childVNode._lastDomChild !== null) {
        newDom = childVNode._lastDomChild;

        // cleanup _lastDOMChild
        childVNode._lastDomChild = null;
      } else if (excessDomChildren === oldVNode || newDom !== oldDom || newDom.parentNode === null) {
        outer: {
          if (oldDom === null || oldDom.parentNode !== parentDom) {
            parentDom.appendChild(newDom);
          } else {
            for (sibDom = oldDom, j = 0; (sibDom = sibDom.nextSibling) && j < oldChildrenLength; j += 2) {
              if (sibDom === newDom) {
                break outer;
              }
            }
            parentDom.insertBefore(newDom, oldDom);
          }

          /**
           * TODO???
           */
          // Browsers will infer an option's `value` from `textContent` when
          // no value is present. This essentially bypasses our code to set it
          // later in `diff()`. It works fine in all browsers except for IE11
          // where it breaks setting `select.value`. There it will be always set
          // to an empty string. Re-applying an options value will fix that, so
          // there are probably some internal data structures that aren't
          // updated properly.
          //
          // To fix it we make sure to reset the inferred value, so that our own
          // value check in `diff()` won't be skipped.
          if (newParentVNode.type === 'option') {
            parentDom.value = '';
          }
        }
        oldDom = newDom.nextSibling;

        if (typeof newParentVNode.type === 'function') {
          	// At this point, if childVNode._lastDomChild existed, then
						// newDom = childVNode._lastDomChild per line 101. Else it is
						// the same as childVNode._dom, meaning this component returned
						// only a single DOM node
						newParentVNode._lastDomChild = newDom;
        }
      }
    }
    i++;
    return childVNode;
  }
}

/**
 * diff the children of a virtual node
 * @param parentDom DOM element whose children are being diffed
 * @param newParentVNode new parent virtual node
 * @param oldParnetVNode old parent virtual node
 * @param context curent context object
 * @param isSvg whether or not the DOM node is a SVG node
 * @param excessDomChildren ???TODO:.
 * @param commitQueue list of components which will be invoked in commitRoot
 * @param oldDom current DOM
 * @param isHydrating whether or not in hydration
 */
export const diffChildren = (
  parentDom,
	newParentVNode,
	oldParentVNode,
	context,
	isSvg,
	excessDomChildren,
	commitQueue,
	oldDom,
	isHydrating
) => {
  let oldVNode, newDom, sibDom, firstChildDom, refs;
  let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR;
  let oldChildrenLength = oldChildren.length;

  if (oldDom === EMPTY_OBJ) {
    oldDom = excessDomChildren[0];
  } else if (oldChildrenLength) {
    oldDom = getDOMSibling(oldParentVNode, 0);
  } else {
    oldDom = null;
  }

  i = 0;

  // flatten children. UPDATE SOURCE CODE.
  const data = {
    newParentVNode,
    oldVNode,
    oldChildrenLength,
    newDom,
    parentDom,
    firstChildDom,
    context,
    isSvg,
    excessDomChildren,
    commitQueue,
    oldDom,
    isHydrating,
    refs,
  }
  newParentVNode._children = toChildArray(newParentVNode._children, transformBeforeFlatten(data, i));

  // remove children that are not part of any vnode
  if (excessDomChildren !== null && typeof newParentVNode.type !== 'function') {
    for (i  = excessDomChildren.length; i >= 0 ; i--) {
      if (excessDomChildren[i] !== null) {
        removeNode(excessDomChildren[i])
      }
    }
  }

  // TODO. remove remaining oldChildren
  for (i = oldChildrenLength; i >=0; i--) {
    if (oldChildren[i] !== null) {
      unmount(oldChildren[i], oldChildren[i]);
    }
  }

  // TODO. set refs only after unmount
  if (refs) {
    for(i = 0; i < ref.length; i++) {
      applyRef(refs[i], refs[++i], refs[++i]);
    }
  }
}