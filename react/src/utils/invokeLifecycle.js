// invoke componentWillMount lifecycle
export const invokeWillMountLifecycle = (c, newType) => {
  if (!newType.getDerivedStateFromProps && c.componentWillMount) {
    c.componentWillMount();
  }
}

// invoke componentDidMount lifecycle
export const invokeDidMountLifecycle = (c) => {
  if (c.componentDidMount) {
    c._renderCallbacks.push(c.componentDidMount);
  }
}

// invoke componentWillReceiveProps lifecycle
export const invokeWillReceivePropsLifecycle = (c, newType, cctx) => {
  const force = c._force;
  if (newType.getDerivedStateFromProps === null && force === null && c.componentWillReceiveProps !== null) {
    c.componentWillReceiveProps(newProps, cctx);
  }
}

// invoke componentWillUpdate lifecycle
export const invokeWillUpdateLifecycle = (c, newProps, cctx) => {
  if (c.componentWillUpdate != null) {
    c.componentWillUpdate(newProps, c._nextState, cctx);
  }
}

// invoke componentDidUpdate lifecycle
export const invokeDidUpdateLifecycle = (c, oldProps, oldState, snapshot) => {
  if (c.componentDidUpdate != null) {
    c._renderCallbacks.push(() => {
      c.componentDidUpdate(oldProps, oldState, snapshot);
    });
  }
}