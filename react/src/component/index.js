import { assign } from '../utils/obj'
import { enqueueRender } from '../render/renderQueue';
import { Fragment } from '../create-element';
/**
 * base compoent class.
 * @param {*} props initial component props
 * @param {*} context initial context from parent components
 */
export function Component(props, context) {
  this.props = props;
  this.context = context;
}

/**
 * update component state and trigger re-render
 * @param {object | ((s: object, p: object) => object)} update an object of
 * state properties to update or a function that takes current state and props
 * and return a new state,
 * @param callback a function to be called once component state is updated
 *
 */
Component.prototype.setState = function(update, callback) {
  let s;
  if (this._nextState !== this.state) {
    s = this._nextState;
  } else {
    s = this._nextState = assign({}, this.state);
  }

  if (typeof update === 'function') {
    update = update(s, this.props);
  }

  if (update) {
    assign(s, update);
  }

  if (this._vnode) {
    this._force = false;
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  }
}

/**
 * perform a synchronous re-render of the component
 * @param callback a function to be called once component state is updated
 */
Component.prototype.forceUpdate = function(callback) {
  if (this._vnode) {
    // set render mode to force. forceUpdate should never call shouldComponentUpdate
    this._force = true;
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  }
}

/**
 * accets `props` and `state`, and returns a new virtual dom tree.
 *
 */
Component.prototype.render = Fragment;
