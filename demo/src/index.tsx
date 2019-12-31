import { render, Component, h } from 'my-react';

class App extends Component {
  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}

render(<App />, document.getElementById('root'));