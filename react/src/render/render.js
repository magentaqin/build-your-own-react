import { commitRoot } from './commitQueue';
import { diff } from '../diff';
import { assign } from '../utils/obj';
import { getDOMSibling, updateParentDomPointers } from './dom';

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