import { IS_NON_DIMENSIONAL } from '../utils/constants'



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

/**
 * remove dom node.
 * @param node the node to remove
 */
export const removeNode = (node) => {
  if (node) {
    const parentNode = node.parentNode;
    if (parentNode) parentNode.removeChild(node);
  }
}

// set style. UPDATE SOURCE CODE.
export function setStyle(style, key, value) {
	if (key[0] === '-') {
    style.setProperty(key, value);
    return;
  }

  if (typeof value === 'number' && !IS_NON_DIMENSIONAL.test(key)) {
    style[key] = value + 'px';
    return;
  }

  if (value === null) {
    style[key] = '';
  } else {
    style[key] = value;
  }
}

/**
 * set a property value on DOM node
 * @param dom the DOM node to modify
 * @param name name of the property to set
 * @param value value of the property to set
 * @param oldValue old value of the property
 * @param isSvg Whether or not this DOM node is an SVG node or not
 */
export function setProperty(dom, name, value, oldValue, isSvg) {
  if (isSvg) {
    if (name === 'className') {
      name = 'class';
    }
  } else if (name === 'class') {
    name = 'className';
  }

  // TODO
  if (name === 'key' || name === 'children') {
    return;
  }

  if (name === 'style') {
    const s = dom.style;
    if (typeof value === 'string') {
      s.cssText = value;
    } else {
      if (typeof oldValue === 'string') {
        s.cssText = '';
        oldValue = null;
      }

      if (oldValue) {
        for (let i in oldValue) {
          if (!(value && i in value)) {
            setStyle(s, i, '');
          }
        }
      }

      if (value) {
        for (let i in value) {
          if (!oldValue || value[i] !== oldValue[i]) {
            setStyle(s, i, value[i]);
          }
        }
      }
    }
    return;
  }

  // TODO.
  if (name[0] === 'o' && name[1] === 'n') {
    let useCapture = name !== (name = name.replace(/Capture$/, ''));
		let nameLower = name.toLowerCase();
		name = (nameLower in dom ? nameLower : name).slice(2);

		if (value) {
			if (!oldValue) dom.addEventListener(name, eventProxy, useCapture);
			(dom._listeners || (dom._listeners = {}))[name] = value;
		} else {
			dom.removeEventListener(name, eventProxy, useCapture);
    }
    return;
  }

  // TODO.
  if (typeof value !== 'function' && name !== 'dangerouslySetInnerHTML') {
    if (name !== (name = name.replace(/^xlink:?/, ''))) {
			if (value == null || value === false) {
				dom.removeAttributeNS(
					'http://www.w3.org/1999/xlink',
					name.toLowerCase()
				);
			} else {
				dom.setAttributeNS(
					'http://www.w3.org/1999/xlink',
					name.toLowerCase(),
					value
				);
			}
		} else if (value == null || value === false) {
			dom.removeAttribute(name);
		} else {
			dom.setAttribute(name, value);
		}
  }
}

/**
 * TODO.
 */
export const updateParentDomPointers = (vnode) => {
  vnode = vnode._parent;
  if (vnode !== null && vnode._component !== null) {
    vnode._component.base = null;
    vnode._dom = vnode._component.base;
    for (let i = 0; i < vnode._children.length; i++) {
      let child = vnode._children[i];
      if (child !== null && child._dom !== null) {
        vnode._dom = vnode._component.base = child._dom;
        break;
      }
    }
    return updateParentDomPointers(vnode);
  }
}