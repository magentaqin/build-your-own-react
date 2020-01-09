import { Component } from '../component';
import { assign } from '../utils/obj';
import {
  invokeWillMountLifecycle,
  invokeDidMountLifecycle,
  invokeWillReceivePropsLifecycle,
  invokeWillUpdateLifecycle,
  invokeDidUpdateLifecycle,
} from '../utils/invokeLifecycle';
import { toChildArray, diffChildren } from './children';
import { diffElementNodes } from './element';
import options from '../options';
import { Fragment } from '../create-element';

let count = 0;

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

export const diff = (
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
  count++;
  console.log(`Diff time count: ${count}`, newVNode)

  /**
   * SECURITY WORK.
   * constructor of vnode is initialized to undefined.
   * Check this initial value to prevent JSON-injection.
   */
  if (newVNode.constructor !== undefined) return null;

  /**
   * TODO:.DO NOT KNOW WHY.
   */
  if ((tmp = options._diff)) tmp(newVNode);

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
            c.render = doRender;
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
        if (newType.getDerivedStateFromProps) {
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
          invokeWillMountLifecycle(c, newType);
          invokeDidMountLifecycle(c);
        } else {
          invokeWillReceivePropsLifecycle(c, newType, cctx);

          // check whether or not component should update
          if (!c._force && c.shouldComponentUpdate !== null && c.shouldComponentUpdate(newProps, c._nextState, cctx) === false) {
            c.props = newProps;
            c.state = c._nextState;
            c._dirty = false;
            c._vnode = newVNode;
            newVNode._dom = oldVNode._dom;
            newVNode._children = oldVNode._children;
            if (c._renderCallbacks.length) {
              commitQueue.push(c);
            }
            for (tmp = 0; tmp < newVNode._children.length; tmp++) {
              if (newVNode._children[tmp]) {
                newVNode._children[tmp]._parent = newVNode;
              }
            }

            // break whole block
            break outer;
          }
          invokeWillUpdateLifecycle(c, newProps, cctx);
          invokeDidUpdateLifecycle(c, oldProps, oldState, snapshot);
        }

        c.context = cctx;
        c.props = newProps;
        c.state = c._nextState;

        if ((tmp = options._render)) tmp(newVNode);
        c._dirty = false;
        c._vnode = newVNode;
        c._parentDom = parentDom;

        tmp = c.render(c.props, c.state, c.context);

        let isTopLevelFragment = tmp != null && tmp.type == Fragment && tmp.key == null;
        newVNode._children = toChildArray(isTopLevelFragment ? tmp.props.children : tmp);

        if (c.getChildContext) {
          context = assign(assign({}, context), c.getChildContext())
        }

        if (!isNew && c.getSnapshotBeforeUpdate !== null) {
          snapshot = c.getSnapshotBeforeUpdate(oldProps, oldState);
        }

        // diff children
        diffChildren(
          parentDom,
          newVNode,
          oldVNode,
          context,
          isSvg,
          excessDomChildren,
          commitQueue,
          oldDom,
          isHydrating
        );

        c.base = newVNode._dom;
        if(c._renderCallbacks.length) {
          commitQueue.push(c);
        }
        if (clearProcessingException) {
          c._pendingError = c._processingException = null;
        }
        c._force = null;
      } else {
        // diff element nodes
        newVNode._dom = diffElementNodes(
          oldVNode._dom,
          newVNode,
          oldVNode,
          context,
          isSvg,
          excessDomChildren,
          commitQueue,
          isHydrating
        );
      }
      // TODO
      if ((tmp = options.diffed)) tmp(newVNode);
    }
  } catch (e) {
    options._catchError(e, newVNode, oldVNode);
  }
  console.log('vnode', newVNode)
  console.log('****DIFF POPPED***')
  return newVNode._dom;
}


/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}
