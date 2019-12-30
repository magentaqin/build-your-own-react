import { render, Component } from 'my-react';

class App extends Component {
  render() {
    return (
      <h1>Hello World</h1>
    )
  }
}

render(<App />, document.body);