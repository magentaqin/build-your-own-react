/**
 *
 * @param {*} type node name or Component
 * @param {*} props properties of the virtual node
 * @param {*} key key for virtual node.
 * @param {*} ref ref property
 */
export const createVNode = (type,props,key,ref) => {
  const vnode = {
    type,
    props,
    key,
    ref,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    _lastDomChild: null,
    _component: null,
    constructor: undefined
  }

  // TODO:. DO NOT KNOW WHY.
  if (options.vnode) options.vnode(vnode);
  return vnode;
}


/**
 * create an virtual node.
 * @param type The node name or Component
 * @param props The properties of the virtual node
 * @param children The children of the virtual node
 */
export const createElement = (type, props, children) => {
  //exclude 'key' and 'ref' key values.
  const normalizedProps = {};
  const normalizedChildren = [];

  for (let key in props) {
    if (key !== 'key' && key !== 'ref') {
      normalizedProps[key] = props[key];
    }
  }

  // UPDATE SOURCE CODE. HAD BETTER NOT MUTATE PARAMS PASSED.
  // treat arguments[2...n] as normalizedChildren
  if (children !== null) {
    for (i = 2; i < arguments.length; i++) {
      normalizedChildren.push(arguments[i]);
    }
    normalizedProps.children = normalizedChildren;
  }

  /**
   *  TODO:. defaultProps role?
   */
  // type maybe string or undefined. filter out this case and apply defaultProps to normalizedProps
  if (typeof type === 'function' && type.defaultProps) {
    for (key in type.defaultProps) {
      if (!normalizedProps[key]) {
        normalizedProps[key] = type.defaultProps[key];
      }
    }
  }

  return createVNode(type, normalizedProps, props && props.key, props && props.ref);
}

// check if it is a valid VNode
export const isValidElement = vnode => {
  return vnode !== null && vnode.constructor === undefined;
}

// create ref
export const createRef = () => {
  return {};
}

// fragment
export const Fragment = (props) => {
  return props.children;
}