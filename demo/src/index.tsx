import myReact, { x } from 'my-react';

class App extends myReact.Component {
  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}

myReact.render(<App />, document.getElementById('root'));