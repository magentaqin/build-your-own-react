import { setProperty } from '../render/dom';
/**
 * diff the old and new properties of a VNode and apply changes to the DOM node.
 * @param dom the dom node to apply
 * @param newProps new props
 * @param oldProps old props
 * @param isSvg Whether or not this node is an SVG node
 * @param hydrate Whether or not we are in hydration mode
 */
export const diffProps = (dom, newProps, oldProps, isSvg, hydrate) => {
  let i;

	for (i in oldProps) {
		if (!(i in newProps)) {
			setProperty(dom, i, null, oldProps[i], isSvg);
		}
	}

	for (i in newProps) {
		if (
			(!hydrate || typeof newProps[i] == 'function') &&
			i !== 'value' &&
			i !== 'checked' &&
			oldProps[i] !== newProps[i]
		) {
			setProperty(dom, i, newProps[i], oldProps[i], isSvg);
		}
	}
}