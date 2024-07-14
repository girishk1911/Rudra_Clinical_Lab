import logo from './logo.svg';
import './App.css';
import Navbar from './CommonComponents/Navbar/navbar';
import HomeScreen from './Pages/HomeScreen/homeScreen';


import {Routes, Route} from 'react-router-dom';
import Status from './Pages/StatusPage/status';
import Report from './Pages/ReportPage/report';
import Prescription from './Pages/Prescription/prescription';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <Routes>
        <Route path='/' element={<HomeScreen/>}/>
        <Route path='/status' element={<Status/>}/>
        <Route path='/report/:id' element={<Report/>}/>
        <Route path='/prescription/:id' element={<Prescription/>}/>

      </Routes>
      

      
      
      
      

    </div>
  );
}

export default App;
