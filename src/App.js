import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import Form from './Components/Form';

function App() {
  return (
    <Provider store={store}>
      <Form />
    </Provider>
  );
}

export default App;
