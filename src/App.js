import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import Form from './Components/Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendorDashboard from './Components/VendorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/dashboard" element={<VendorDashboard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
