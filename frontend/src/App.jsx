import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddNewTask from './components/AddNewTask';
import EditTask from './components/EditTask'
import Navbar from './components/Navbar';
import { Context } from './main';
import { useContext } from 'react';
import SummaryPage from './components/SummaryPage';
import AboutUs from './components/AboutUs';


function App() {


  const {isAuthenticated, setIsAuthenticated,user} = useContext(Context)


  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<AboutUs/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/addNew' element={<AddNewTask/>}/>
          <Route path='/summary' element={<SummaryPage/>}/>
          <Route path='/updateTask/:id' element={<EditTask/>}/>
        </Routes>
        <ToastContainer position='center' autoClose={3000} />
      </Router>
    </>
  )
}

export default App
