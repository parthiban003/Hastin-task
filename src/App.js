import logo from './logo.svg';
import './App.css';
import Form from './Components/Form';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import VendorDashboard from './Components/VendorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import VendorEdit from './Components/VendorEdit';



function App() {
  return (
    <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/dashboard" element={<VendorDashboard />} />
          <Route path="/vendoredit/:id" element={<VendorEdit />} />
        </Routes>
      
    </BrowserRouter>
  );
}

export default App;
