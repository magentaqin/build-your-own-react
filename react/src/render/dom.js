/**
 * get dom sibling
 * @param vnode
 * @param childIndex
 */
export const getDOMSibling = (vnode, childIndex) => {
  if (childIndex === null) {
    return vnode._parent ? getDOMSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1) : null;
  }

  let sibling;
  for(; childIndex < vnode._children.length; childIndex++) {
    sibling = vnode._children[childIndex];

    if (sibling !== null && sibling._dom !== null) {
      return sibling._dom;
    }
  }

  return typeof vnode.type === 'function' ? getDOMSibling(vnode) : null;
}