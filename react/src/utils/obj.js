// copy properties from `props` to `obj`
export const assign = (obj, props) => {
  for (let i in props) {
    obj[i] = props[i];
  }
  return obj;
}

