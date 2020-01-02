import myReact, { x } from 'my-react';

class App extends myReact.Component {
  componentWillMount() {
    console.log('I WILL MOUNT.');
  }

  componentDidMount() {
    console.log('I AM MOUNTED.')
  }

  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}

myReact.render(<App />, document.getElementById('root'));