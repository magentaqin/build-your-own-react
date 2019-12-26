// invoke componentWillMount lifecycle
export const invokeWillMountLifecycle = (c) => {
  if (newType.getDerivedStateFromProps === null && c.componentWillMount !== null) {
    c.componentWillMount();
  }
}