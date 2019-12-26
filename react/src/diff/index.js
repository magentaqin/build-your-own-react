import { Component } from '../component/componentClass';
import { assign } from '../utils/obj';
import { invokeWillMountLifecycle } from '../utils/invokeLifecycle';


/**
 * diff two virtual nodes and apply changes to the DOM
 *
 * @param parentDom parent of the DOM element
 * @param newVNode new virtual node
 * @param oldVNode old virtual node
 * @param context current context object
 * @param isSvg whether or not this is an SVG node
 * @param excessDomChildren ???TODO:.
 * @param commitQueue list of components which will be invoked in commitRoot
 * @param oldDom current DOM
 * @param isHydrating whether or not in hydration
 */

const diff = (
  parentDom,
  newVNode,
  oldVNode,
  context,
  isSvg,
  excessDomChildren,
  commitQueue,
  oldDom,
  isHydrating,
) => {
  // TODO:. what is tmp?
  let tmp, newType = newVNode.type;

  /**
   * SECURITY WORK.
   * constructor of vnode is initialized to undefined.
   * Check this initial value to prevent JSON-injection.
   */
  if (newVNode.constructor !== undefined) return null;

  /**
   * TODO:.DO NOT KNOW WHY.
   */
  // if ((tmp = options._diff)) tmp(newVNode);

  try {
    outer: {
      if (typeof newType === 'function') {
        // TODO:.
        let c, isNew, oldProps, oldState, snapshot, clearProcessingException;
        let newProps = newVNode.props;

        /**
         * necessary for createContext api
         * UPDATE SOURCE CODE.
         */
        tmp = newType.contextType;
        let provider = tmp && context[tmp._id];
        let cctx;
        if (tmp) {
          if (provider) {
            cctx = provider;
          } else {
            cctx = provider.props.value;
          }
        } else {
          cctx = context;
        }


        // set old node's _component to `c`. UPDATE SOURCE CODE.
        if (oldVNode._component) {
          newVNode._component = oldVNode._component;
          c = newVNode._component;

          c._processingException = c._pendingError;
          clearProcessingException = c._processingException;
        } else {
          // instantiate the new component
          if ('prototype' in newType && newType.prototype.render) {
            c = new newType(newProps, cctx);
            newVNode._component = c;
          } else {
            c = new Component(newProps, cctx);
            newVNode._component = c;
            c.constructor = newType;
            c.render = this.constructor(props, context);
          }

          // TODO:.
          if(provider) provider.sub(c);

          // handle props and state of `c`
          c.props = newProps;
          if (!c.state) {
            c.state = {};
          }

          // TODO:. difference between `c.context` and `c._context`.
          c.context = cctx;
          c._context = context;
          isNew = c._dirty = true;
          c._renderCallbacks = [];
        }

        // invoke getDerivedStateFromProps
        if (c._nextState === null) {
          c._nextState = c.state;
        }
        if (newType.getDerivedStateFromProps !== null) {
          if (c._nextState === c.state) {
            c._nextState = assign({}, c._nextState)
          }

          assign(c._nextState, newType.getDerivedStateFromProps(newProps, c._nextState));
        }

        // assign props and state of `c` to oldProps and oldState
        oldProps = c.props;
        oldState = c.state;

        // invoke pre-render lifecycle methods.UPDATE SOURCE CODE.
        if (isNew) {
          invokeWillMountLifecycle(c);

          if (c.componentDidMount !== null) {
            c._renderCallbacks.push(c.componentDidMount);
          }
        } else {
          const force = c._force;
          if (newType.getDerivedStateFromProps === null && force === null && c.componentWillReceiveProps !== null) {
            c.componentWillReceiveProps(newProps, cctx);
          }



        }





      }
    }
  } catch (e) {

  }
}

