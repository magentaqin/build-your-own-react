# build-your-own-react

Some comment flags I wrote while engineering:

* TODO:
I haven't figure out why it is necessary to put code there.

* UPDATE SOURCE CODE:

* SECURITY WORK.

* BROWSER COMPATIBLE WORK.


### Self-made 'React'

**Description**
It is actually a re-engineering verion of [Preact](https://github.com/preactjs/preact).

**Questions**

1. The differences between `Preact` and `React`:

* The way to compile JSX.
https://babeljs.io/docs/en/babel-preset-typescript
option `jsxPragma` is set to `h` in Preact, while it is set to `React` in React. It means: Babel will transform `<div id="hello"/>` to `React.createElement("div", {id: "hello"})` by default and "jsxPragma: h" will generate it to `h("div", { id: "hello"})`. To know more about `h`, you can read this https://jasonformat.com/wtf-is-jsx/ and play this demo  https://codepen.io/developit/pen/aOYywe.

* Browser Compatible.