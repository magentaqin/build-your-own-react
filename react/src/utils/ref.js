import options from '../options';

/**
 * invoke or update a ref, depending on whether it is a function or object ref.
 * @param ref
 * @param value
 * @param vnode
 */
export const applyRef = (ref, value, vnode) => {
  try {
    if (typeof ref === 'function') {
      ref(value);
    } else {
      ref.current = value;
    }
  } catch (e) {
    options._catchError(e, vnode);
  }
}