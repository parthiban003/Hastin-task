import './App.css';
import Form from './Components/Form';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import VendorDashboard from './Components/VendorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import VendorEdit from './Components/VendorEdit';
import VendorCreate from './Components/VendorCreate';
import { ToastContainer } from 'react-toastify';
import AccessCodeModal from './Components/AccessCodeModal';



function App() {
  return (
    <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path='/' element={<AccessCodeModal />}/>
          <Route path="/dashboard" element={<VendorDashboard />} />
          <Route path="/vendoredit/:id" element={<VendorEdit />} />
          <Route path='/vendorcreate' element={<VendorCreate />} />
        </Routes>
      <ToastContainer position="top-right" autoClose={3000}  theme="colored"  hideProgressBar={false}/>
    </BrowserRouter>
  );
}

export default App;
