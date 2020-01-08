# 🚀 build-your-own-react

### Description

Most of you have already read many blogs explaining how React/Redux/React Redux works with some source code snippets.  It seems that you can handle those interview questions successfully. But it is far from being a React Jedi until you can build, assemble, and customize them by yourself.

This repo contains 3 parts: my-react, my-redux and my-react-redux. It is actually a **re-engineering version of**  **[Preact](https://github.com/preactjs/preact), [Redux](https://github.com/reduxjs/redux), and [React Redux](https://github.com/reduxjs/redux).**

I will walk you through 3 basic demos with some XMind workflows to help both of us better understand what's going on under the hood. 



###Play By yourself

```bash
git clone https://github.com/magentaqin/build-your-own-react.git

yarn install

yarn start
```



### 🙌 Demos

#### Demo One: Hello World

This workflow explains how a simply "Hello World" is rendered through `my-react`.

Basically, there are 2 steps. 

####Demo Two: Render List

#### Demo Three: Counter



### Troubleshooting

**1. What does "re-engineer" mean? Does it mean "copy and paste code"?**

I changed babel option pragma from 'h' to 'x'.

2.The differences between `Preact` and `React`? Why do you choose `preact` instead of `react` to re-engineer?

* The way to compile JSX.
https://babeljs.io/docs/en/babel-preset-typescript
option `jsxPragma` is set to `h` in Preact, while it is set to `React` in React. It means: Babel will transform `<div id="hello"/>` to `React.createElement("div", {id: "hello"})` by default and "jsxPragma: h" will generate it to `h("div", { id: "hello"})`. To know more about `h`, you can read this https://jasonformat.com/wtf-is-jsx/ and play this demo  https://codepen.io/developit/pen/aOYywe.

* Browser Compatible.

  

Some comment flags I wrote while re-engineering:

* TODO:
  I haven't figure out why it is necessary to put code there.

* UPDATE SOURCE CODE:

* SECURITY WORK.

* BROWSER COMPATIBLE WORK.

