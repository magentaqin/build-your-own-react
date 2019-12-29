import { EMPTY_ARR, EMPTY_OBJ } from "../utils/constants";
import { diffProps } from './props';
import { diffChildren } from './children';

/**
 * diff two virtual nodes representing DOM element
 * @param dom dom element representing the virtual nodes being diffed
 * @param newVNode new virtual node
 * @param oldVNode old virtual node
 * @param context current context object
 * @param isSvg whether or not this is an SVG node
 * @param excessDomChildren ???TODO:.
 * @param commitQueue list of components which will be invoked in commitRoot
 * @param isHydrating whether or not we are in hydration
 */
export const diffElementNodes = (
  dom,
  newVNode,
  oldVNode,
  context,
  isSvg,
  excessDomChildren,
  commitQueue,
  isHydrating,
) => {
  let i;
	let oldProps = oldVNode.props;
	let newProps = newVNode.props;

	// Tracks entering and exiting SVG namespace when descending through the tree.
  isSvg = newVNode.type === 'svg' || isSvg;

  // TODO. child.nodeType === 3???
  if (dom === null && excessDomChildren !== null) {
    for (i = 0; i < excessDomChildren.length; i++) {
			const child = excessDomChildren[i];

			if (
				child != null &&
				(newVNode.type === null
					? child.nodeType === 3
					: child.localName === newVNode.type)
			) {
				dom = child;
				excessDomChildren[i] = null;
				break;
			}
		}
  }

  if (dom === null) {
    if (newVNode.type === null) {
      return document.createTextNode(newProps);
    }

    dom = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', newVNode.type) : document.createElement(newVNode.type);
    // already created a new parent, so previously attached children can not be reused.
    excessDomChildren = null;
  }

  if (newVNode.type === null) {
    if (excessDomChildren !== null) {
      const index = excessDomChildren.indexOf(dom);
      excessDomChildren[index] = null;
    }

    if (oldProps !== newProps) {
      dom.data = newProps;
    }
  } else if (newVNode !== oldVNode) {
    if (excessDomChildren !== null) {
      excessDomChildren = EMPTY_ARR.slice.call(dom.childNodes);
    }

    oldProps = oldVNode.props || EMPTY_OBJ;

    let oldHtml = oldProps.dangerouslySetInnerHTML;
    let newHtml = newProps.dangerouslySetInnerHTML;

    // during hydration, props are not diffed at all (including dangerouslySetInnerHTML)
    if (!isHydrating) {
      if (oldProps === EMPTY_OBJ) {
        oldProps = {};
        for (let i = 0; i < dom.attributes.length; i++) {
          const attributeName = dom.attributes[i].name;
          oldProps[attributeName] = dom.attributes[i].value;
        }
      }

      if (newHtml || oldHtml) {
        // avoid re-applying the same '__html' if nothing changed between re-render
        if (!newHtml || !oldHtml || newHtml.__html !== oldHtml.__html) {
          dom.innerHTML = (newHtml && newHtml.__html) || '';
        }
      }
    }

    diffProps(dom, newProps, oldProps, isSvg, isHydrating);

		newVNode._children = newVNode.props.children;

    // If the new vnode didn't have dangerouslySetInnerHTML, diff its children
		if (!newHtml) {
			diffChildren(
				dom,
				newVNode,
				oldVNode,
				context,
				newVNode.type === 'foreignObject' ? false : isSvg,
				excessDomChildren,
				commitQueue,
				EMPTY_OBJ,
				isHydrating
			);
		}


		// (as above, don't diff props during hydration)
		if (!isHydrating) {
			if (
				'value' in newProps &&
				newProps.value !== undefined &&
				newProps.value !== dom.value
			) {
				dom.value = newProps.value == null ? '' : newProps.value;
			}
			if (
				'checked' in newProps &&
				newProps.checked !== undefined &&
				newProps.checked !== dom.checked
			) {
				dom.checked = newProps.checked;
			}
		}
  }
  return dom;
}