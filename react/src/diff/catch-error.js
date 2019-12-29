import { enqueueRender } from "../render/renderQueue";

/**
 * TODO.UPDATE SOURCE CODE.
 * find the closest error boundary and call it.
 * @param error the thrown value
 * @param vnode the vnode that threw the error(except for the case that the vnode is the top parent that was being unmounted)
 */
export const _catchError = (error, vnode) => {
  let component;

  while (vnode._parent) {
    vnode = vnode._parent;
    if (vnode._component && !component._processingException) {
      try {
        if (component.constructor && component.constructor.getDerivedStateFromError !== null) {
          component.setState(component.constructor.getDerivedStateFromError(error))
        } else {
          if (component.componentDidCatch) {
            component.componentDidCatch(error);
          } else {
            continue;
          }
        }
        component._pendingError = component;
        return enqueueRender(component);
      } catch (e) {
        error = e;
      }
    }
  }

  throw error;
}
